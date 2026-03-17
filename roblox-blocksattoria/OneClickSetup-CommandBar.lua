-- Blocksattoria One-Click Installer
-- Paste this whole file into Roblox Studio Command Bar and press Enter

local function ensure(parent, className, name)
	local obj = parent:FindFirstChild(name)
	if not obj then
		obj = Instance.new(className)
		obj.Name = name
		obj.Parent = parent
	end
	return obj
end

local RS = game:GetService('ReplicatedStorage')
local SSS = game:GetService('ServerScriptService')
local SP = game:GetService('StarterPlayer')
local SPS = ensure(SP, 'StarterPlayerScripts', 'StarterPlayerScripts')

local configSource = [==[
local Config = {}

Config.GameName = "Blocksattoria"

Config.LobbyDuration = 15
Config.RoundDuration = 70
Config.IntermissionDuration = 10

Config.MoonAwakeAt = 55
Config.MoonSpeed = 8
Config.MoonHitDistance = 9

Config.SpawnPlatform = {
	Position = Vector3.new(0, 8, 120),
	Size = Vector3.new(180, 2, 180),
}

Config.WorldCenter = Vector3.new(0, 48, -170)

Config.Planets = {
	Earth = {
		Size = 24,
		Color = Color3.fromRGB(64, 148, 255),
		Position = Vector3.new(0, 56, -220),
	},
	Saturn = {
		Size = 18,
		Color = Color3.fromRGB(226, 196, 145),
		Position = Vector3.new(-82, 70, -262),
		HasRing = true,
	},
	Jupiter = {
		Size = 20,
		Color = Color3.fromRGB(194, 154, 112),
		Position = Vector3.new(80, 62, -252),
	},
	Uranus = {
		Size = 16,
		Color = Color3.fromRGB(127, 213, 223),
		Position = Vector3.new(0, 96, -312),
	},
	Moon = {
		Size = 13,
		Color = Color3.fromRGB(230, 232, 238),
		StartPosition = Vector3.new(0, 64, -380),
		AwakeColor = Color3.fromRGB(255, 120, 120),
	},
}

Config.PlanetRemovalSchedule = {
	{ TimeLeft = 42, Planet = "Saturn" },
	{ TimeLeft = 30, Planet = "Jupiter" },
	{ TimeLeft = 18, Planet = "Uranus" },
}

return Config
]==]

local serverSource = [==[
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
]==]

local avatarSource = [==[
local Players = game:GetService("Players")
local StarterPlayer = game:GetService("StarterPlayer")

-- Keep Roblox-style avatars (not custom morphs)
StarterPlayer.LoadCharacterAppearance = true
StarterPlayer.CharacterRigType = Enum.HumanoidRigType.R15

local function applyRobloxAvatar(player, character)
	local humanoid = character:FindFirstChildOfClass("Humanoid")
	if not humanoid then
		return
	end

	local ok, description = pcall(function()
		return Players:GetHumanoidDescriptionFromUserId(player.UserId)
	end)

	if ok and description then
		pcall(function()
			humanoid:ApplyDescription(description)
		end)
	end
end

Players.PlayerAdded:Connect(function(player)
	player.CharacterAdded:Connect(function(character)
		applyRobloxAvatar(player, character)
	end)
end)
]==]

local clientSource = [==[
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local TweenService = game:GetService("TweenService")

local player = Players.LocalPlayer

local remotes = ReplicatedStorage:WaitForChild("BlocksattoriaRemotes")
local statusEvent = remotes:WaitForChild("Status")

local gui = Instance.new("ScreenGui")
gui.Name = "BlocksattoriaHUD"
gui.ResetOnSpawn = false
gui.IgnoreGuiInset = true
gui.Parent = player:WaitForChild("PlayerGui")

local panel = Instance.new("Frame")
panel.Name = "Panel"
panel.AnchorPoint = Vector2.new(0.5, 0)
panel.Position = UDim2.fromScale(0.5, 0.02)
panel.Size = UDim2.fromScale(0.55, 0.16)
panel.BackgroundColor3 = Color3.fromRGB(12, 18, 32)
panel.BackgroundTransparency = 0.15
panel.BorderSizePixel = 0
panel.Parent = gui

local corner = Instance.new("UICorner")
corner.CornerRadius = UDim.new(0, 12)
corner.Parent = panel

local stroke = Instance.new("UIStroke")
stroke.Color = Color3.fromRGB(120, 176, 255)
stroke.Thickness = 2
stroke.Parent = panel

local phaseLabel = Instance.new("TextLabel")
phaseLabel.Name = "Phase"
phaseLabel.BackgroundTransparency = 1
phaseLabel.Position = UDim2.fromScale(0.03, 0.08)
phaseLabel.Size = UDim2.fromScale(0.45, 0.32)
phaseLabel.Font = Enum.Font.GothamBold
phaseLabel.Text = "BLOCKSATTORIA"
phaseLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
phaseLabel.TextScaled = true
phaseLabel.TextXAlignment = Enum.TextXAlignment.Left
phaseLabel.Parent = panel

local timerLabel = Instance.new("TextLabel")
timerLabel.Name = "Timer"
timerLabel.BackgroundTransparency = 1
timerLabel.Position = UDim2.fromScale(0.66, 0.08)
timerLabel.Size = UDim2.fromScale(0.31, 0.34)
timerLabel.Font = Enum.Font.GothamBold
timerLabel.Text = "00"
timerLabel.TextColor3 = Color3.fromRGB(255, 235, 164)
timerLabel.TextScaled = true
timerLabel.TextXAlignment = Enum.TextXAlignment.Right
timerLabel.Parent = panel

local messageLabel = Instance.new("TextLabel")
messageLabel.Name = "Message"
messageLabel.BackgroundTransparency = 1
messageLabel.Position = UDim2.fromScale(0.03, 0.45)
messageLabel.Size = UDim2.fromScale(0.94, 0.48)
messageLabel.Font = Enum.Font.GothamSemibold
messageLabel.Text = "Waiting for server..."
messageLabel.TextColor3 = Color3.fromRGB(203, 224, 255)
messageLabel.TextScaled = true
messageLabel.TextWrapped = true
messageLabel.TextXAlignment = Enum.TextXAlignment.Left
messageLabel.Parent = panel

local function pulse()
	local grow = TweenService:Create(panel, TweenInfo.new(0.12, Enum.EasingStyle.Quad, Enum.EasingDirection.Out), {
		Size = UDim2.fromScale(0.57, 0.165)
	})
	local back = TweenService:Create(panel, TweenInfo.new(0.14, Enum.EasingStyle.Quad, Enum.EasingDirection.In), {
		Size = UDim2.fromScale(0.55, 0.16)
	})
	grow:Play()
	grow.Completed:Connect(function()
		back:Play()
	end)
end

local function formatTime(value)
	if typeof(value) ~= "number" then
		return "--"
	end
	if value < 0 then
		value = 0
	end
	return string.format("%02d", math.floor(value))
end

local function update(payload)
	if typeof(payload) ~= "table" then
		return
	end

	phaseLabel.Text = string.upper(payload.Phase or "Blocksattoria")
	timerLabel.Text = formatTime(payload.TimeLeft)
	messageLabel.Text = payload.Message or ""

	if payload.Phase == "Round" then
		stroke.Color = Color3.fromRGB(255, 113, 113)
	elseif payload.Phase == "Lobby" then
		stroke.Color = Color3.fromRGB(120, 176, 255)
	else
		stroke.Color = Color3.fromRGB(111, 235, 172)
	end

	if payload.Emphasis then
		messageLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
		pulse()
	else
		messageLabel.TextColor3 = Color3.fromRGB(203, 224, 255)
	end
end

statusEvent.OnClientEvent:Connect(update)
]==]

local config = ensure(RS, 'ModuleScript', 'BlocksattoriaConfig')
config.Source = configSource

local server = ensure(SSS, 'Script', 'BlocksattoriaServer')
server.Source = serverSource

local avatar = ensure(SSS, 'Script', 'BlocksattoriaAvatarServer')
avatar.Source = avatarSource

local client = ensure(SPS, 'LocalScript', 'BlocksattoriaClient')
client.Source = clientSource

print('Blocksattoria installed. Press Play to test, then Publish to Roblox.')
