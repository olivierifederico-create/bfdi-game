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
