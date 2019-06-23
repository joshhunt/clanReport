function time(t) {
  const [mins, seconds] = t.split(":");
  return parseInt(mins, 10) * 60 + parseInt(seconds, 10);
}

export default {
   936308438: [ time("8:58"), time("10:05") ], // Garden World
  1282886582: [ time("6:03"), time("10:10") ], // Exodus Crash
  3372160277: [ time("4:00"), time("06:07") ], // Lake of Shadows
  3280234344: [ time("7:22"), time("12:31") ], // Savathun’s Song
   522318687: [ time("4:48"), time("07:26") ], // Strange Terrain
  3145298904: [ time("7:59"), time("07:59") ], // Arms Dealer
  4259769141: [ time("7:55"), time("09:47") ], // Inverted Spire
  3289589202: [ time("6:41"), time("11:46") ], // Pyramidion
  3718330161: [ time("7:04"), time("10:13") ], // Tree of Probabilities
   272852450: [ time("8:13"), time("10:17") ], // Will of the Thousands
  1034003646: [ time("6:58"), time("09:51") ], // Insight Terminus
  3701132453: [ time("8:00"), time("09:30") ], // Hollowed Lair
  3108813009: [ time("9:21"), time("11:57") ], // Warden of Nothing
  3034843176: [ time("6:43"), time("08:49") ]  // The Corrupted
};
