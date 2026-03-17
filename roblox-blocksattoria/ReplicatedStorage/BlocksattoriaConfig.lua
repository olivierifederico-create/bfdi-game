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
