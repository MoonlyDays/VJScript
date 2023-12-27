//-------------------------------------------------------------------------------------//
// This code was automatically generated using VJScript.
// VJScript is an automatic code translation tool from JavaScript to Squirrel
// https://github.com/MoonlyDays/VJScript
//-------------------------------------------------------------------------------------//
// Source Script Name: code.js
// Compile Time: Wed Dec 27 2023 14:54:05 GMT+0200 (Eastern European Standard Time)
// VJScript Version: 0.1.0
//-------------------------------------------------------------------------------------//

class Light {
  Color = null
  LightProp = null
  SoundEnt = null
  constructor(color) {
    this.Color = ""
    this.Color = color
    this.LightProp = Entities.FindByName(null, "light_" + color + "")
    this.SoundEnt = Entities.FindByName(null, "snd_" + color + "")
  }
  function turnOn() {
    this.LightProp.SetSkin(0)
    EntFireByHandle(this.SoundEnt, "PlaySound", "", (- 1), null, null)
  }
  function turnOff() {
    this.LightProp.SetSkin(1)
  }
}
local g_kScoreText = Entities.FindByName(null, "text_score")
local g_kRecordText = Entities.FindByName(null, "text_record")
local g_kColors = ["red", "green", "yellow", "blue"]
local g_kLights = {
}
foreach (color in g_kColors) {
  g_kLights[color] <- Light(color)
}
function getLight (color) {
  return g_kLights[color]
}
local l = getLight("blue")
l.turnOn()
function PlayerThink () {
  printl(self.GetName())
  return (- 1)
}
