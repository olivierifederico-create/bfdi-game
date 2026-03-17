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
