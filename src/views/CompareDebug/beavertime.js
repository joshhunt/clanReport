function time(t) {
  const [mins, seconds] = t.split(":");
  return parseInt(mins, 10) * 60 + parseInt(seconds, 10);
}

export default {
  936308438: time("8:58"), //  Garden World: 8:58
  1282886582: time("6:03"), // Exodus Crash: 6:03
  3372160277: time("4:00"), // Lake of Shadows: 4:00
  3280234344: time("7:22"), // Savathun’s Song 7:22
  522318687: time("4:48"), //  Strange Terrain 4:48
  3145298904: time("8:04"), // Arms Dealer 8:04
  4259769141: time("7:55"), // Inverted Spire 7:55
  3289589202: time("6:41"), // Pyramidion 6:41
  3718330161: time("7:04"), // Tree of Probabilities 7:04
  272852450: time("8:13"), //  Will of the Thousands 8:13
  1034003646: time("6:58"), // Insight Terminus 6:58
  3701132453: time("8:00"), // Hollowed Lair 8:00
  3108813009: time("9:21"), // Warden of Nothing 9:21
  3034843176: time("6:43") //  TThe Corrupted 6:43
};

export const fastishTimes = {
  936308438: time("12:14"), //  Garden World: 8:58
  1282886582: time("10:10"), // Exodus Crash: 6:03
  3372160277: time("6:07"), // Lake of Shadows: 4:00
  3280234344: time("12:31"), // Savathun’s Song 7:22
  522318687: time("8:28"), //  Strange Terrain 4:48
  3145298904: time("9:02"), // Arms Dealer 8:04
  4259769141: time("9:47"), // Inverted Spire 7:55
  3289589202: time("11:46"), // Pyramidion 6:41
  3718330161: time("10:13"), // Tree of Probabilities 7:04
  272852450: time("10:17"), //  Will of the Thousands 8:13
  1034003646: time("12:34"), // Insight Terminus 6:58
  3701132453: time("9:21"), // Hollowed Lair 8:00
  3108813009: time("8:49"), // Warden of Nothing 9:21
  3034843176: time("8:49") //  The Corrupted 6:43
};
