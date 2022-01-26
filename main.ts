namespace SpriteKind {
    export const Ammo = SpriteKind.create()
}
namespace StatusBarKind {
    export const Ammo = StatusBarKind.create()
}
function StartNewPlane (speed: number) {
    plane = sprites.create(img`
        ..fff.........ffffff....
        ..f8ff.......fff66ff....
        ..f88ff...fffffffff.....
        ..f688ffff66668886ff....
        ..f668ff6666666688f9f...
        ..ff6666666666666f999f..
        .f66f666666666f11199f6f.
        f66fffffff666699111f666f
        fffffff666f666666666666f
        .....f6666886666666666f.
        ....f666688ff6666666ff..
        ...f666688ffffffffff....
        ...f6666fff.............
        ...fffffff..............
        ........................
        ........................
        `, SpriteKind.Player)
    statusbar_ammo = statusbars.create(20, 4, StatusBarKind.Ammo)
    statusbar_ammo.value = 50
    statusbar_ammo.max = 50
    statusbar_ammo.setColor(9, 15)
    statusbar_ammo.attachToSprite(plane)
    plane.x += -50
    controller.moveSprite(plane, speed, speed)
    plane.startEffect(effects.trail, 100)
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
            . . . 1 1 . . . . . . . . . . . 
            . . . . 1 1 . . . . . . . . . . 
            . . 2 1 1 f 5 f 1 1 1 8 . . . . 
            . 4 5 1 1 5 f 5 1 1 1 8 8 2 . . 
            . . 2 1 1 f 5 f 1 1 1 8 . . . . 
            . . . . 1 1 . . . . . . . . . . 
            . . . 1 1 . . . . . . . . . . . 
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
        value.destroy(effects.fire, 10)
    }
    StartNewPlane(planespeed)
})
info.onLifeZero(function () {
    game.over(false, effects.melt)
})
sprites.onOverlap(SpriteKind.Ammo, SpriteKind.Player, function (sprite, otherSprite) {
    sprite.setImage(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . 2 . 
        . . . . . . 5 . . 5 5 . . 1 1 1 
        . . 5 . . 5 5 . 5 . . 5 . f 5 f 
        . 5 5 5 . . 5 . 5 . . 5 . 5 f 5 
        . . 5 . . . 5 . 5 . . 5 . 1 1 1 
        . . . . . . 5 . . 5 5 . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `)
    sprite.destroy(effects.starField, 1000)
    statusbar_ammo.value += 10
})
// Sestreleni bubliny
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Ammo, function (sprite, otherSprite) {
    otherSprite.setImage(img`
        . 3 . . . . . . . . . . . 4 . . 
        . 3 3 . . . . . . . . . 4 4 . . 
        . 3 d 3 . . 4 4 . . 4 4 d 4 . . 
        . . 3 5 3 4 5 5 4 4 d d 4 4 . . 
        . . 3 d 5 d 1 1 d 5 5 d 4 4 . . 
        . . 4 5 5 1 1 1 1 5 1 1 5 4 . . 
        . 4 5 5 5 5 1 1 5 1 1 1 d 4 4 . 
        . 4 d 5 1 1 5 5 5 1 1 1 5 5 4 . 
        . 4 4 5 1 1 5 5 5 5 5 d 5 5 4 . 
        . . 4 3 d 5 5 5 d 5 5 d d d 4 . 
        . 4 5 5 d 5 5 5 d d d 5 5 4 . . 
        . 4 5 5 d 3 5 d d 3 d 5 5 4 . . 
        . 4 4 d d 4 d d d 4 3 d d 4 . . 
        . . 4 5 4 4 4 4 4 4 4 4 4 . . . 
        . 4 5 4 . . 4 4 4 . . . 4 4 . . 
        . 4 4 . . . . . . . . . . 4 4 . 
        `)
    otherSprite.destroy(effects.fire, 500)
    projectile.destroy()
})
// Sestreleni bubliny
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    otherSprite.setImage(img`
        . 3 . . . . . . . . . . . 4 . . 
        . 3 3 . . . . . . . . . 4 4 . . 
        . 3 d 3 . . 4 4 . . 4 4 d 4 . . 
        . . 3 5 3 4 5 5 4 4 d d 4 4 . . 
        . . 3 d 5 d 1 1 d 5 5 d 4 4 . . 
        . . 4 5 5 1 1 1 1 5 1 1 5 4 . . 
        . 4 5 5 5 5 1 1 5 1 1 1 d 4 4 . 
        . 4 d 5 1 1 5 5 5 1 1 1 5 5 4 . 
        . 4 4 5 1 1 5 5 5 5 5 d 5 5 4 . 
        . . 4 3 d 5 5 5 d 5 5 d d d 4 . 
        . 4 5 5 d 5 5 5 d d d 5 5 4 . . 
        . 4 5 5 d 3 5 d d 3 d 5 5 4 . . 
        . 4 4 d d 4 d d d 4 3 d d 4 . . 
        . . 4 5 4 4 4 4 4 4 4 4 4 . . . 
        . 4 5 4 . . 4 4 4 . . . 4 4 . . 
        . 4 4 . . . . . . . . . . 4 4 . 
        `)
    otherSprite.destroy(effects.fire, 500)
    info.changeScoreBy(1)
    projectile.destroy()
})
let ammo: Sprite = null
let spaceenemy: Sprite = null
let projectile: Sprite = null
let statusbar_ammo: StatusBarSprite = null
let plane: Sprite = null
let planespeed = 0
planespeed = 50
StartNewPlane(planespeed)
info.setLife(3)
game.onUpdateInterval(1000, function () {
    spaceenemy = sprites.create(img`
        . . . . . . . . c c c c . . . . 
        . . . . c c c c c c c c c . . . 
        . . . c f c c a a a a c a c . . 
        . . c c f f f f a a a c a a c . 
        . . c c a f f c a a f f f a a c 
        . . c c a a a a b c f f f a a c 
        . c c c c a c c b a f c a a c c 
        c a f f c c c a b b 6 b b b c c 
        c a f f f f c c c 6 b b b a a c 
        c a a c f f c a 6 6 b b b a a c 
        c c b a a a a b 6 b b a b b a . 
        . c c b b b b b b b a c c b a . 
        . . c c c b c c c b a a b c . . 
        . . . . c b a c c b b b c . . . 
        . . . . c b b a a 6 b c . . . . 
        . . . . . . b 6 6 c c . . . . . 
        `, SpriteKind.Enemy)
    spaceenemy.setVelocity(randint(-55, -40), 0)
    spaceenemy.setPosition(160, randint(5, 115))
    spaceenemy.setFlag(SpriteFlag.AutoDestroy, true)
    if (statusbar_ammo.value <= 40) {
        if (Math.percentChance(15)) {
            ammo = sprites.create(img`
                ....................
                ....................
                ....................
                ....................
                ....................
                ....................
                .....7977777777.....
                .....7777777777.....
                ......66666666......
                ......77777777......
                .....7797777777.....
                .....751f5f1177.....
                .....2415f51127.....
                .....751f5f1177.....
                .....7777777777.....
                .....7777777776.....
                .....7777777776.....
                ......76666666......
                ....................
                ....................
                `, SpriteKind.Ammo)
            ammo.setVelocity(-70, 0)
            ammo.setPosition(160, randint(5, 115))
            ammo.setFlag(SpriteFlag.AutoDestroy, true)
        }
    }
})
