module.exports = { load: load }
function load() {
  return {
    player: {
      weaponsConfig: {
        wrench: { materia: [ 'redstone_bristar' ], materiaArity: 2 }
      , fists: { materia: [ ], materiaArity: 4 }
      , banana: { materia: [ ], materiaArity: 0 }
      }
    , materiaXP: {
        // materia name    xp
        redstone_bristar: 1
      , bluestone_fortran: 1
      , summon_beowulf_geonetti: 1
      , bluestone_placehold_1: 1
      , bluestone_placehold_2: 1
      , bluestone_placehold_3: 1
      , bluestone_placehold_4: 1
      , bluestone_placehold_5: 1
      , bluestone_placehold_6: 1
      }
    , health: 20
    , maxHealth: 20
    }
  , lastSavePoint: null
  , plotPoints: [ ]
  }
}
