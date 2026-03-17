local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local TweenService = game:GetService("TweenService")

local Config = require(ReplicatedStorage:WaitForChild("BlocksattoriaConfig"))

local remotes = ReplicatedStorage:FindFirstChild("BlocksattoriaRemotes")
if not remotes then
	remotes = Instance.new("Folder")
	remotes.Name = "BlocksattoriaRemotes"
	remotes.Parent = ReplicatedStorage
end

local statusEvent = remotes:FindFirstChild("Status")
if not statusEvent then
	statusEvent = Instance.new("RemoteEvent")
	statusEvent.Name = "Status"
	statusEvent.Parent = remotes
end

local state = {
	WorldFolder = nil,
	Planets = {},
	LatestPayload = nil,
	RoundCount = 0,
}

local function getAllParts(instance)
	local parts = {}
	for _, descendant in ipairs(instance:GetDescendants()) do
		if descendant:IsA("BasePart") then
			table.insert(parts, descendant)
		end
	end
	return parts
end

local function setModelColor(model, color)
	for _, part in ipairs(getAllParts(model)) do
		part.Color = color
	end
end

local function broadcast(payload)
	state.LatestPayload = payload
	statusEvent:FireAllClients(payload)
end

local function makeSpawn()
	local spawnLocation = workspace:FindFirstChild("BlocksattoriaSpawn")
	if not spawnLocation then
		spawnLocation = Instance.new("SpawnLocation")
		spawnLocation.Name = "BlocksattoriaSpawn"
		spawnLocation.Neutral = true
		spawnLocation.Anchored = true
		spawnLocation.CanCollide = false
		spawnLocation.Transparency = 1
		spawnLocation.Parent = workspace
	end

	spawnLocation.Size = Vector3.new(20, 1, 20)
	spawnLocation.Position = Config.SpawnPlatform.Position + Vector3.new(0, 5, 0)
end

local function createPlanet(name, data, parent)
	local model = Instance.new("Model")
	model.Name = name
	model.Parent = parent

	local body = Instance.new("Part")
	body.Name = "Body"
	body.Shape = Enum.PartType.Ball
	body.Anchored = true
	body.CanCollide = false
	body.Material = Enum.Material.SmoothPlastic
	body.Size = Vector3.new(data.Size, data.Size, data.Size)
	body.Position = data.Position or data.StartPosition
	body.Color = data.Color
	body.Parent = model

	if data.HasRing then
		local ring = Instance.new("Part")
		ring.Name = "Ring"
		ring.Anchored = true
		ring.CanCollide = false
		ring.Shape = Enum.PartType.Cylinder
		ring.Material = Enum.Material.Neon
		ring.Color = Color3.fromRGB(244, 227, 176)
		ring.Size = Vector3.new(data.Size * 0.3, data.Size * 1.8, data.Size * 1.8)
		ring.CFrame = CFrame.new(body.Position) * CFrame.Angles(math.rad(90), 0, math.rad(14))
		ring.Parent = model
	end

	model.PrimaryPart = body
	return model
end

local function createWorld()
	if state.WorldFolder then
		state.WorldFolder:Destroy()
	end

	local worldFolder = Instance.new("Folder")
	worldFolder.Name = "BlocksattoriaWorld"
	worldFolder.Parent = workspace
	state.WorldFolder = worldFolder
	state.Planets = {}

	local platform = Instance.new("Part")
	platform.Name = "SpawnPlatform"
	platform.Anchored = true
	platform.Size = Config.SpawnPlatform.Size
	platform.Position = Config.SpawnPlatform.Position
	platform.Material = Enum.Material.Grass
	platform.Color = Color3.fromRGB(80, 178, 94)
	platform.Parent = worldFolder

	local border = Instance.new("Part")
	border.Name = "SpawnBorder"
	border.Anchored = true
	border.Size = Vector3.new(Config.SpawnPlatform.Size.X + 10, 2, Config.SpawnPlatform.Size.Z + 10)
	border.Position = Config.SpawnPlatform.Position - Vector3.new(0, 2, 0)
	border.Material = Enum.Material.Slate
	border.Color = Color3.fromRGB(75, 84, 103)
	border.Parent = worldFolder

	local centerLight = Instance.new("Part")
	centerLight.Name = "CenterLight"
	centerLight.Anchored = true
	centerLight.CanCollide = false
	centerLight.Shape = Enum.PartType.Ball
	centerLight.Size = Vector3.new(9, 9, 9)
	centerLight.Position = Config.WorldCenter
	centerLight.Material = Enum.Material.Neon
	centerLight.Color = Color3.fromRGB(255, 248, 199)
	centerLight.Parent = worldFolder

	local pointLight = Instance.new("PointLight")
	pointLight.Range = 180
	pointLight.Brightness = 2.2
	pointLight.Color = Color3.fromRGB(255, 242, 174)
	pointLight.Parent = centerLight

	for name, data in pairs(Config.Planets) do
		local planet = createPlanet(name, data, worldFolder)
		state.Planets[name] = planet
	end

	makeSpawn()
end

local function sendPlayerState(player)
	if state.LatestPayload then
		statusEvent:FireClient(player, state.LatestPayload)
	end
end

Players.PlayerAdded:Connect(function(player)
	task.delay(1, function()
		sendPlayerState(player)
	end)
end)

local function takePlanetAway(name)
	local model = state.Planets[name]
	if not model then
		return
	end

	broadcast({
		Phase = "Round",
		Message = name .. " has been taken away!",
		Emphasis = true,
	})

	for _, part in ipairs(getAllParts(model)) do
		local tween = TweenService:Create(
			part,
			TweenInfo.new(1.6, Enum.EasingStyle.Quad, Enum.EasingDirection.In),
			{
				Position = part.Position + Vector3.new(0, 80, 0),
				Transparency = 1,
			}
		)
		tween:Play()
	end

	task.wait(1.8)
	if model.Parent then
		model:Destroy()
	end
	state.Planets[name] = nil
end

local function damageNearbyPlayers(position, radius, damage)
	for _, player in ipairs(Players:GetPlayers()) do
		local character = player.Character
		if character and character:FindFirstChild("HumanoidRootPart") and character:FindFirstChild("Humanoid") then
			local root = character.HumanoidRootPart
			local humanoid = character.Humanoid
			if (root.Position - position).Magnitude <= radius then
				humanoid:TakeDamage(damage)
			end
		end
	end
end

local function moveMoonStep(dt)
	local moon = state.Planets.Moon
	local earth = state.Planets.Earth
	if not moon or not earth or not moon.PrimaryPart or not earth.PrimaryPart then
		return false
	end

	local moonPos = moon:GetPivot().Position
	local earthPos = earth:GetPivot().Position
	local offset = earthPos - moonPos
	local distance = offset.Magnitude

	if distance <= Config.MoonHitDistance then
		return true
	end

	local direction = offset.Unit
	local step = Config.MoonSpeed * dt
	local newPos = moonPos + direction * math.min(step, distance)
	moon:PivotTo(CFrame.new(newPos))

	return false
end

local function moonCollision()
	local earth = state.Planets.Earth
	if not earth or not earth.PrimaryPart then
		return
	end

	broadcast({
		Phase = "Round",
		Message = "The Moon collided with Earth!",
		Emphasis = true,
	})

	setModelColor(earth, Color3.fromRGB(255, 92, 92))

	local explosion = Instance.new("Explosion")
	explosion.Position = earth.PrimaryPart.Position
	explosion.BlastRadius = 48
	explosion.BlastPressure = 0
	explosion.Parent = workspace

	damageNearbyPlayers(explosion.Position, 120, 80)
	task.wait(2)
end

local function runCountdown(phase, duration, text)
	for t = duration, 1, -1 do
		broadcast({
			Phase = phase,
			TimeLeft = t,
			Message = text,
		})
		task.wait(1)
	end
end

local function runRound()
	state.RoundCount += 1

	local moon = state.Planets.Moon
	if moon and Config.Planets.Moon.StartPosition then
		moon:PivotTo(CFrame.new(Config.Planets.Moon.StartPosition))
		setModelColor(moon, Config.Planets.Moon.Color)
	end

	broadcast({
		Phase = "Round",
		TimeLeft = Config.RoundDuration,
		Message = "Round " .. state.RoundCount .. " started!",
	})

	local removed = {}
	local moonAwake = false
	local collisionHappened = false

	for t = Config.RoundDuration, 1, -1 do
		if t <= Config.MoonAwakeAt and not moonAwake then
			moonAwake = true
			if moon then
				setModelColor(moon, Config.Planets.Moon.AwakeColor)
			end
			broadcast({
				Phase = "Round",
				TimeLeft = t,
				Message = "The Moon has awakened!",
				Emphasis = true,
			})
		end

		for _, schedule in ipairs(Config.PlanetRemovalSchedule) do
			if t == schedule.TimeLeft and not removed[schedule.Planet] then
				removed[schedule.Planet] = true
				takePlanetAway(schedule.Planet)
			end
		end

		if moonAwake then
			for _ = 1, 10 do
				if moveMoonStep(0.1) then
					collisionHappened = true
					break
				end
				task.wait(0.1)
			end
		else
			task.wait(1)
		end

		broadcast({
			Phase = "Round",
			TimeLeft = t - 1,
			Message = "Survive the moon event!",
		})

		if collisionHappened then
			moonCollision()
			return
		end
	end

	broadcast({
		Phase = "Round",
		TimeLeft = 0,
		Message = "Round finished. Earth survived this time!",
		Emphasis = true,
	})
	task.wait(2)
end

while true do
	createWorld()

	runCountdown("Lobby", Config.LobbyDuration, "Get ready. The moon wakes up soon.")
	runRound()
	runCountdown("Intermission", Config.IntermissionDuration, "Intermission")
end
