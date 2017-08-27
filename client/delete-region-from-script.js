var collider = require('./collider')
  , setupSmoothCamera = require('./set-up-smooth-camera-for-loaded-level-and-player')

module.exports = deleteRegionFromScript

function deleteRegionFromScript(regionNameToDelete, levelName, xString, yString) {

  var args = arguments
  
  console.log('hiiiiiiiiiiiiiii')
  var thing = {
    update: function(core) {
      console.log('hiiiiiiiiiiiiiii again')
      THING = thing
      var regionToDelete = core.entities.filter(obj => obj.name == regionNameToDelete)[0]
      R = regionToDelete
      coll = collider
      if(!regionToDelete) { return }
      var objectsInRegion = (core
 //         .tileMap
 //         .getOthersNear(regionToDelete)
            .entities
            .filter(it => (
              (it.bounds && collider.collidesWith.bind(regionToDelete)(it))
            ||(!it.bounds && collider.intersects(regionToDelete.bounds(), [it.x, it.y, 0, 0]))
            ))
          )
      objectsInRegion.map(core.removeEntity.bind(core))

      setupSmoothCamera(core, core.entities.find(function(ent) { return ent.name === 'player' }))

      core.removeEntity(this)
    }
  }

  return thing

}
