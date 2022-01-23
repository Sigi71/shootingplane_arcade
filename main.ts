namespace SpriteKind {
    export const Ammo = SpriteKind.create()
}
namespace StatusBarKind {
    export const Ammo = StatusBarKind.create()
}
function StartNewPlane () {
    plane = sprites.create(img`
        ..ccc.........ffffff....
        ..f4cc.......fcc22ff....
        ..f44cc...fffccccff.....
        ..f244cccc22224442cc....
        ..f224cc2222222244b9c...
        ..cf2222222222222b999c..
        .c22c222222222b11199b2c.
        f22ccccccc222299111b222c
        fffffcc222c222222222222f
        .....f2222442222222222f.
        ....f222244fc2222222ff..
        ...c222244ffffffffff....
        ...c2222cfffc2f.........
        ...ffffffff2ccf.........
        .......ffff2cf..........
        ........fffff...........
        `, SpriteKind.Player)
    statusbar_ammo = statusbars.create(20, 4, StatusBarKind.Ammo)
    statusbar_ammo.value = 50
    statusbar_ammo.max = 50
    statusbar_ammo.setColor(5, 15)
    statusbar_ammo.attachToSprite(plane)
    plane.x += -50
    controller.moveSprite(plane, 200, 200)
    plane.startEffect(effects.bubbles, 100)
    plane.setStayInScreen(true)
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (statusbar_ammo.value > 0) {
        projectile = sprites.createProjectileFromSprite(img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . 4 4 . . . . . . . 
            . . . . . . 4 5 5 4 . . . . . . 
            . . . . . . 2 5 5 2 . . . . . . 
            . . . . . . . 2 2 . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, plane, 50, 0)
        projectile.setFlag(SpriteFlag.AutoDestroy, true)
        statusbar_ammo.value += -1
    }
})
// Zasah letadla bublinou
sprites.onOverlap(SpriteKind.Enemy, SpriteKind.Player, function (sprite, otherSprite) {
    plane.destroy()
    scene.cameraShake(3, 500)
    info.changeLifeBy(-1)
    for (let value of sprites.allOfKind(SpriteKind.Enemy)) {
        value.destroy(effects.bubbles, 10)
    }
    StartNewPlane()
})
info.onLifeZero(function () {
    game.over(false, effects.splatter)
})
sprites.onOverlap(SpriteKind.Ammo, SpriteKind.Player, function (sprite, otherSprite) {
    ammo.destroy(effects.starField, 100)
    statusbar_ammo.value += 10
})
// Sestreleni bubliny
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    otherSprite.destroy(effects.fire, 500)
    info.changeScoreBy(1)
    projectile.destroy()
})
let spaceenemy: Sprite = null
let ammo: Sprite = null
let projectile: Sprite = null
let statusbar_ammo: StatusBarSprite = null
let plane: Sprite = null
StartNewPlane()
info.setLife(3)
game.onUpdateInterval(1000, function () {
    spaceenemy = sprites.create(img`
        . . . . . b b b b b b . . . . . 
        . . . b b 9 9 9 9 9 9 b b . . . 
        . . b b 9 9 9 9 9 9 9 9 b b . . 
        . b b 9 d 9 9 9 9 9 9 9 9 b b . 
        . b 9 d 9 9 9 9 9 1 1 1 9 9 b . 
        b 9 d d 9 9 9 9 9 1 1 1 9 9 9 b 
        b 9 d 9 9 9 9 9 9 1 1 1 9 9 9 b 
        b 9 3 9 9 9 9 9 9 9 9 9 1 9 9 b 
        b 5 3 d 9 9 9 9 9 9 9 9 9 9 9 b 
        b 5 3 3 9 9 9 9 9 9 9 9 9 d 9 b 
        b 5 d 3 3 9 9 9 9 9 9 9 d d 9 b 
        . b 5 3 3 3 d 9 9 9 9 d d 5 b . 
        . b d 5 3 3 3 3 3 3 3 d 5 b b . 
        . . b d 5 d 3 3 3 3 5 5 b b . . 
        . . . b b 5 5 5 5 5 5 b b . . . 
        . . . . . b b b b b b . . . . . 
        `, SpriteKind.Enemy)
    spaceenemy.setVelocity(randint(-55, -40), 0)
    spaceenemy.setPosition(160, randint(5, 115))
    spaceenemy.setFlag(SpriteFlag.AutoDestroy, true)
    if (Math.percentChance(15)) {
        ammo = sprites.create(img`
            . . . . . e e e e e e . . . . . 
            . . . e e 5 5 5 5 5 5 e e . . . 
            . . e e 5 5 5 5 5 5 5 5 e e . . 
            . e e 9 d 5 5 5 5 5 5 5 5 e e . 
            . e 9 d 5 5 5 5 5 1 1 1 5 5 e . 
            e 4 d d 5 5 5 5 5 1 1 1 5 5 5 e 
            e 4 d 5 5 5 5 5 5 1 1 1 5 5 5 e 
            e 4 4 5 5 5 5 5 5 5 5 5 1 5 5 e 
            e 5 4 d 5 5 5 5 5 5 5 5 5 5 5 e 
            e 5 4 4 5 5 5 5 5 5 5 5 5 d 5 e 
            e 5 d 4 4 5 5 5 5 5 5 5 d d 5 e 
            . e 5 4 4 4 d 5 5 5 5 d d 5 e . 
            . e d 5 4 4 4 4 4 4 4 d 5 e e . 
            . . e d 5 d 4 4 4 4 5 5 e e . . 
            . . . e e 5 5 5 5 5 5 e e . . . 
            . . . . . e e e e e e . . . . . 
            `, SpriteKind.Ammo)
        ammo.setVelocity(-70, 0)
        ammo.setPosition(160, randint(5, 115))
        ammo.setFlag(SpriteFlag.AutoDestroy, true)
    }
})
