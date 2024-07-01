import { system, world, EquipmentSlot, GameMode, EntityComponentTypes, ItemComponentTypes, ItemStack, EnchantmentTypes} from "@minecraft/server";
//Armor effects. I split into 4 because it should reduce the amount of commands running at a time reducing the random lag spikes
system.runInterval(() => {
    world.getDimension("overworld").runCommandAsync("execute as @a run function pfe_armor/effects");
    system.runTimeout(() => {
        world.getDimension("overworld").runCommandAsync("execute as @a run function pfe_armor/effects_2");
        system.runTimeout(() => {
            world.getDimension("overworld").runCommandAsync("execute as @a run function pfe_armor/effects_3");
            system.runTimeout(() => {
                world.getDimension("overworld").runCommandAsync("execute as @a run function pfe_armor/effects_4");
            }, 40);
        }, 80);
    }, 120);
}, 180);
// Boss events
system.runInterval(() => {
    world.getDimension("overworld").runCommandAsync("execute at @r run summon poke:boss_event ~ -65 ~")
}, 108000);

// Tool Durability gotten from https://wiki.bedrock.dev/items/tool-durability.html
function damage_item(item) {
    // Get durability
    const durabilityComponent = item.getComponent("durability")
    var unbreaking = 0
    // Get unbreaking level
    if (item.hasComponent("enchantments")) {
        unbreaking = item.getComponent("enchantments").enchantments.getEnchantment("unbreaking")
        if (!unbreaking) {
            unbreaking = 0
        } else {
            unbreaking = unbreaking.level
        }
    }
    // Apply damage
    if (durabilityComponent.damage == durabilityComponent.maxDurability) {

        return
    }
    durabilityComponent.damage += Number(Math.round(Math.random() * 100) <= durabilityComponent.getDamageChance(unbreaking))
    return item
}
/*
function damage_item(item) {
    // Get durability
    const durabilityComponent = item.getComponent("durability")
    var unbreaking = 0
    // Get unbreaking level
    if (item.hasComponent(ItemComponentTypes.Enchantable)) {
        if(item.getComponent(ItemComponentTypes.Enchantable).hasEnchantment('unbreaking') == true){
            unbreaking = item.getComponent(ItemComponentTypes.Enchantable).getEnchantment("unbreaking");
            if (!unbreaking) {
                unbreaking = 0
            } else {
                unbreaking = unbreaking.level
            }
            console.warn(unbreaking)
            return;
        }
    }
    // Apply damage
    if (durabilityComponent.damage == durabilityComponent.maxDurability) {
        return
    }
    durabilityComponent.damage += Number(Math.round(Math.random() * 100) <= durabilityComponent.getDamageChance(unbreaking))
    console.warn(durabilityComponent.damage += Number(Math.round(Math.random() * 100) <= durabilityComponent.getDamageChance()))
    return item
}*/
// Add your item IDs into this array
const my_items = ["poke:medic_haxel","poke:cobalt_crossbow","poke:astral_crossbow","poke:godly_crossbow","poke:demonic_haxel","poke:holy_battleaxe","poke:godly_battleaxe","poke:galaxy_battleaxe","poke:astral_battleaxe","poke:amethyst_battleaxe","poke:netherite_battleaxe","poke:diamond_battleaxe","poke:gold_battleaxe","poke:void_battleaxe","poke:death_battleaxe","poke:demonic_battleaxe","poke:hellish_battleaxe","poke:emerald_battleaxe","poke:iron_battleaxe","poke:onyx_battleaxe","poke:shade_battleaxe","poke:cobalt_battleaxe","poke:stone_battleaxe","poke:wood_battleaxe","poke:radium_battleaxe","poke:hellish_scythe","poke:ember_scythe","poke:emerald_scythe","poke:nebula_battleaxe","poke:diamond_scythe","poke:shade_scythe","poke:nebula_scythe","poke:godly_scythe","poke:galactic_scythe","poke:radium_scythe","poke:amethyst_scythe","poke:onyx_scythe","poke:gold_scythe","poke:cobalt_scythe","poke:netherite_scythe","poke:void_scythe","poke:holy_scythe","poke:iron_scythe","poke:demonic_slasher","poke:death_scythe","poke:godly_haxel","poke:radium_haxel","poke:cobalt_haxel","poke:shade_haxel","poke:wooden_haxel","poke:stone_haxel","poke:iron_haxel","poke:gold_haxel","poke:emerald_haxel","poke:diamond_haxel","poke:netherite_haxel","poke:hellish_haxel","poke:holy_haxel","poke:amethyst_haxel","poke:haxel","poke:swift_pickaxe","poke:snow_shovel","poke:nebula_hoe","poke:cobalt_sword","poke:astral_sword","poke:onyx_sword","poke:demonic_sword","poke:void_sword","poke:pocket_knife","poke:amethyst_sword","poke:circuit_sword","poke:hellish_blade","poke:nebula_sword","poke:galaxy_sword","poke:godly_sword","poke:holy_sword","poke:shade_sword","poke:radium_sword",]
world.afterEvents.playerBreakBlock.subscribe(event => {
    // If there's no item, skip
    if (!event.itemStackAfterBreak) return
    // If the item is not in our item IDs, skip
    if (!my_items.includes(event.itemStackAfterBreak.typeId)) return
    // If player is in creative, skip
    if (world.getPlayers({
        gameMode: GameMode.creative
    }).includes(event.player)) return
    const newItem = damage_item(event.itemStackAfterBreak)
    event.player.getComponent(EntityComponentTypes.Equippable).setEquipment(EquipmentSlot.Mainhand, newItem)
    if (!newItem) {
        event.player.playSound("random.break")
    }
    return;
});
// End of Tool durability 
//Food effects / Projectile shooters
const pfeefood = ["poke:blazooka","poke:windzooka","poke:golden_chicken","poke:rotten_chicken","poke:demonic_potion","poke:hellish_potion","poke:nebula_potion","poke:void_potion","poke:death_potion","poke:cobalt_potion","poke:cobalt_soup","poke:crimson_sporeshroom_stew","poke:root_beer","poke:hellish_soup","poke:nebula_noodles","poke:warped_sporeshroom_stew","poke:milk_bottle","poke:banished_star_x10","poke:banished_star_x9"];
const pfeprojitems = ["poke:nuke_ring","poke:necromancer_staff","poke:ring_3","poke:ring_4","poke:ring_2","poke:arrow_ring","poke:shade_ring",]
const pitems = pfeefood + pfeprojitems
world.afterEvents.itemCompleteUse.subscribe(pfefood => {
    const plocationx= pfefood.source.getViewDirection().x;
    const plocationy= pfefood.source.getViewDirection().y;
    const plocationz= pfefood.source.getViewDirection().z;
    const plocation= pfefood.source.location;
    const headlocate = pfefood.source.getHeadLocation();
    if (!pitems.includes(pfefood.itemStack.typeId)) return;
    if (pfeprojitems.includes(pfefood.itemStack.typeId)){ //Projectile shooters. projectile id defined in a tag on the item
        const ptag = pfefood.itemStack.getTags();
        const aangle = pfefood.source.getViewDirection();
        const proj = pfefood.source.dimension.spawnEntity(''+ptag,headlocate);
        const proje = proj.getComponent("projectile");
        proje.owner = pfefood.source;
        proje.shoot(aangle);
        return;
    };
    if (pfefood.itemStack.typeId == "poke:windzooka"){pfefood.source.applyKnockback(plocationx,plocationz,-7,-plocationy*4);pfefood.source.playSound('wind_charge.burst');pfefood.source.dimension.spawnParticle('minecraft:wind_explosion_emitter',plocation);return;}
    if (pfefood.itemStack.typeId == "poke:blazooka"){pfefood.source.applyKnockback(plocationx,plocationz,7,-plocationy*-4);pfefood.source.playSound('wind_charge.burst');pfefood.source.dimension.spawnParticle('minecraft:wind_explosion_emitter',plocation);pfefood.source.dimension.spawnParticle('poke:blazooka_flame',plocation);return;}
    if (pfefood.itemStack.typeId == "poke:cobalt_soup"){pfefood.source.addEffect('night_vision', 2400,{showParticles: false});return};
    if (pfefood.itemStack.typeId == "poke:root_beer") {pfefood.source.addEffect('speed', 600, {amplifier: 4,});return};
    if (pfefood.itemStack.typeId == "poke:crimson_sporeshroom_stew") {pfefood.source.addEffect('fire_resistance', 1200);return};
    if (pfefood.itemStack.typeId == "poke:warped_sporeshroom_stew") {pfefood.source.addEffect('fire_resistance', 1200);return};
    if (pfefood.itemStack.typeId == "poke:hellish_soup") {pfefood.source.addEffect('fire_resistance', 1200);return};
    if (pfefood.itemStack.typeId == "poke:nebula_noodles") {pfefood.source.addEffect('strength', 600, {amplifier: 7,});return};
    if (pfefood.itemStack.typeId == "poke:milk_bottle") {pfefood.source.runCommandAsync("effect @s clear");return};
    if (pfefood.itemStack.typeId == "poke:demonic_potion") {pfefood.source.runCommandAsync("function pfe_items/demonic_potion");return};
    if (pfefood.itemStack.typeId == "poke:hellish_potion") {pfefood.source.runCommandAsync("function pfe_items/hellish_potion");return};
    if (pfefood.itemStack.typeId == "poke:nebula_potion") {pfefood.source.runCommandAsync("function pfe_items/nebula_potion");return};
    if (pfefood.itemStack.typeId == "poke:void_potion") {pfefood.source.runCommandAsync("function pfe_items/void_potion");return};
    if (pfefood.itemStack.typeId == "poke:death_potion") {pfefood.source.runCommandAsync("kill @s");return};
    if (pfefood.itemStack.typeId == "poke:rotten_chicken") {pfefood.source.addEffect('nausea', 400);return};
    if (pfefood.itemStack.typeId == "poke:golden_chicken") {pfefood.source.addEffect('village_hero', 400, {amplifier: 1,});return};
    if (pfefood.itemStack.typeId == "poke:demonic_potion") {pfefood.source.runCommandAsync("function pfe_items/demonic_potion");return};
    if (pfefood.itemStack.typeId == "poke:banished_star_x10") {pfefood.source.runCommandAsync("damage @a[r=100] 32767000 entity_attack entity @s");return};
    if (pfefood.itemStack.typeId == "poke:banished_star_x9") {pfefood.source.runCommandAsync("damage @s 32767000 entity_attack");return};
    console.warn('not found')
    return;
});
//Block interact events that do not use custom components
const interact_blocks = ["poke:listener_trophy","poke:furnace_golem_trophy","poke:cobalt_golem_block"]
const interact_items = ["poke:pocket_knife","poke:void_upgrader","poke:shade_upgrader","poke:onyx_upgrader","poke:nebula_upgrader","poke:holy_upgrader","poke:hellish_upgrader","poke:godly_upgrader","poke:galaxy_upgrader","poke:demonic_upgrader","poke:cobalt_upgrader","poke:astral_upgrader","poke:stone_upgrader","poke:redstone_upgrader","poke:obsidian_depressor","poke:netherite_upgrader","poke:nether_upgrader","poke:lapis_upgrader","poke:iron_upgrader","poke:gold_upgrader","poke:end_upgrader","poke:emerald_upgrader","poke:diamond_upgrader","poke:copper_upgrader","poke:coal_upgrader","poke:budificator"]
world.afterEvents.playerInteractWithBlock.subscribe(event => {
    if (interact_blocks.includes(event.block.typeId)) {
        if (event.block.typeId == "poke:listener_trophy") {event.player.playMusic('record.listen',{fade:5});return;}
        if (event.block.typeId == "poke:furnace_golem_trophy") {event.player.playMusic('poke.record.pigstep',{fade:5});return;}
        var block_location_x = event.block.x
        var block_location_y = event.block.y
        var block_location_z = event.block.z
        if (event.block.typeId == "poke:cobalt_golem_block") {
            event.block.dimension.runCommandAsync('execute positioned '+ block_location_x + " "+ block_location_y + " "+ block_location_z +' run summon poke:cobalt_golem'); 
            event.block.setType('minecraft:air');
            return;
        }
        return;
    }
    return;
});
//Hit Effects 
const hit_effects = ["poke:demonic_sword","poke:hellish_sword","poke:godly_sword","poke:holy_sword","poke:radium_sword","poke:astral_sword","poke:shade_sword","poke:nebula_sword","poke:amethyst_scythe","poke:holy_scythe","poke:hellish_scythe","poke:godly_scythe","poke:galactic_scythe","poke:demonic_slasher","poke:ember_scythe","poke:death_scythe","poke:void_scythe","poke:radium_scythe","poke:netherite_scythe","poke:diamond_scythe","poke:shade_scythe","poke:onyx_scythe","poke:iron_scythe","poke:gold_scythe","poke:emerald_scythe","poke:nebula_scythe","poke:cobalt_scythe","poke:circuit_sword","poke:ban_hammer"]
world.afterEvents.entityHitEntity.subscribe(event => {
    if (event.damagingEntity.hasComponent(EntityComponentTypes.Equippable)) {
        if (!hit_effects.includes(event.damagingEntity.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Mainhand).type.id)) return;
        const itemid = event.damagingEntity.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Mainhand).typeId
        if (itemid == 'poke:demonic_sword') {event.hitEntity.addEffect('slowness', 100, {amplifier: 3});return;}
        if (itemid == 'poke:hellish_blade') {event.hitEntity.addEffect('slowness', 40, {amplifier: 3});return;}
        if (itemid == 'poke:godly_sword') {event.damagingEntity.addEffect('strength', 100, {amplifier: 2});return;}
        if (itemid == 'poke:holy_sword') {event.damagingEntity.addEffect('strength', 40, {amplifier: 1});return;}
        if (itemid == 'poke:astral_sword') {event.damagingEntity.addEffect('strength', 100, {amplifier: 2});return;}
        if (itemid == 'poke:shade_sword') {event.hitEntity.addEffect('slowness', 40, {amplifier: 2});event.hitEntity.addEffect('wither', 60, {amplifier: 1});return;}
        if (itemid == 'poke:radium_sword') {event.hitEntity.addEffect('slowness', 220, {amplifier: 3});event.hitEntity.addEffect('wither', 240, {amplifier: 4});return;}
        if (itemid == 'poke:amethyst_scythe') {event.damagingEntity.addEffect('speed', 100, {amplifier: 4});event.hitEntity.addEffect('blindness', 20);return;}
        if (itemid == 'poke:demonic_slasher') {event.damagingEntity.addEffect('speed', 100, {amplifier: 7});event.hitEntity.addEffect('wither', 80, {amplifier:1});return;}
        if (itemid == 'poke:gold_scythe') {event.damagingEntity.addEffect('speed', 100, {amplifier: 2});event.damagingEntity.addEffect('haste', 600, {amplifier: 2});return;}
        if (itemid == 'poke:emerald_scythe') {event.damagingEntity.addEffect('speed', 100, {amplifier: 2});event.damagingEntity.addEffect('village_hero', 2400, {amplifier: 1});return;}
        if (itemid == 'poke:iron_scythe') {event.damagingEntity.addEffect('speed', 100, {amplifier: 2});return;}
        if (itemid == 'poke:onyx_scythe') {event.damagingEntity.addEffect('speed', 200, {amplifier: 5});event.damagingEntity.addEffect('jump_boost', 100, {amplifier: 2});event.hitEntity.addEffect('weakness', 120, {amplifier: 2});return;}
        if (itemid == 'poke:godly_scythe') {event.damagingEntity.addEffect('speed', 200, {amplifier: 6});event.damagingEntity.addEffect('slow_falling', 2400);event.damagingEntity.addEffect('jump_boost', 1200, {amplifier: 3});return;}
        if (itemid == 'poke:hellish_scythe') {event.damagingEntity.addEffect('speed', 100, {amplifier: 7});event.damagingEntity.addEffect('fire_resistance', 2400);event.hitEntity.addEffect('mining_fatigue', 400, {amplifier: 1});return;}
        if (itemid == 'poke:holy_scythe') {event.damagingEntity.addEffect('speed', 200, {amplifier: 6});event.damagingEntity.addEffect('slow_falling', 2400, {amplifier: 1});event.hitEntity.addEffect('darkness', 400);return;}
        if (itemid == 'poke:shade_scythe') {event.damagingEntity.addEffect('absorption', 600, {amplifier: 1});event.damagingEntity.addEffect('strength', 100, {amplifier: 1});event.hitEntity.addEffect('slowness', 160, {amplifier: 2});return;}
        if (itemid == 'poke:diamond_scythe') {event.damagingEntity.addEffect('speed', 160, {amplifier: 3});event.hitEntity.addEffect('weakness', 100, {amplifier: 1});event.hitEntity.addEffect('blindness', 80);return;}
        if (itemid == 'poke:netherite_scythe') {event.damagingEntity.addEffect('speed', 160, {amplifier: 3});event.hitEntity.addEffect('hunger', 120, {amplifier: 1});event.hitEntity.addEffect('slowness', 80, {amplifier: 2});return;}
        if (itemid == 'poke:radium_scythe') {event.damagingEntity.addEffect('speed', 100, {amplifier: 5});event.hitEntity.addEffect('nausea', 80, {amplifier: 1});event.hitEntity.addEffect('fatal_poison', 160, {amplifier: 2});return;}
        if (itemid == 'poke:galactic_scythe') {event.damagingEntity.addEffect('speed', 100, {amplifier: 9});event.damagingEntity.addEffect('fire_resistance', 300);event.hitEntity.addEffect('wither', 80, {amplifier: 2});event.hitEntity.addEffect('weakness', 80, {amplifier: 2});return;}
        if (itemid == 'poke:ember_scythe') {event.damagingEntity.addEffect('speed', 100, {amplifier: 6});event.hitEntity.addEffect('nausea', 80, {amplifier: 1});event.hitEntity.addEffect('blindness', 80);return;}
        if (itemid == 'poke:void_scythe') {event.damagingEntity.addEffect('speed', 200, {amplifier: 6});event.hitEntity.runCommand('function pfe_items/scythe/void');return;}
        if (itemid == 'poke:death_scythe') {event.damagingEntity.addEffect('speed', 200, {amplifier: 6});event.hitEntity.runCommand('function pfe_items/scythe/death');return;}
        if (itemid == 'poke:nebula_scythe') {event.damagingEntity.runCommand('function pfe_items/scythe/nebula');event.hitEntity.addEffect('wither', 80, {amplifier: 3});return;}
        if (itemid == 'poke:cobalt_scythe') {event.damagingEntity.addEffect('speed', 100, {amplifier: 6});event.hitEntity.addEffect('wither', 40, {amplifier: 1});return;}
        if (itemid == 'poke:nebula_sword') {event.damagingEntity.addEffect('strength', 40, {amplifier: 4});event.hitEntity.addEffect('weakness', 20, {amplifier: 2});return;}
        if (itemid == 'poke:ban_hammer') {event.damagingEntity.addEffect('strength', 40, {amplifier: 4});event.hitEntity.addEffect('weakness', 20, {amplifier: 2});return;}
        if (itemid == 'poke:circuit_sword') {event.damagingEntity.runCommand('function pfe_items/circuit_sword');event.hitEntity.addEffect('blindness', 100);return;}
        console.warn('item on list but not found')
        return;
    }
})

//Trapdoor block events
class PFETrapdoor {
    onPlayerInteract(data) {
        var block_location_x = data.block.x
        var block_location_y = data.block.y
        var block_location_z = data.block.z
        if (data.block.permutation.hasTag('pfe_trapdoor_open') == true) {
            data.block.setPermutation(data.block.permutation.withState('poke:trapdoor_open','no'))
            data.block.dimension.runCommandAsync('playsound open.iron_trapdoor @a '+ block_location_x + ' '+ block_location_y+' '+ block_location_z)
            return;
        }
        else {
            data.block.setPermutation(data.block.permutation.withState('poke:trapdoor_open','yes'))
            data.block.dimension.runCommandAsync('playsound close.iron_trapdoor @a '+ block_location_x + ' '+ block_location_y+' '+ block_location_z)
            return;
        }
    }
}
//Fortune enchant for ores
class PFEFortune {
    onPlayerDestroy(data) {
        var block_location_x = data.block.x
        var block_location_y = data.block.y
        var block_location_z = data.block.z
        const gm = data.player.getGameMode()
        var fortuneLevel=data.player.getComponent(EntityComponentTypes.Equippable).getEquipment('Mainhand').getComponent(ItemComponentTypes.Enchantable).getEnchantment("fortune").level
        const blockid = data.destroyedBlockPermutation.type.id.substring(5)
        if (gm == 'survival' && data.player.getComponent(EntityComponentTypes.Equippable).getEquipment('Mainhand').hasComponent(ItemComponentTypes.Enchantable)) {
            if (data.player.getComponent(EntityComponentTypes.Equippable).getEquipment('Mainhand').getComponent(ItemComponentTypes.Enchantable).hasEnchantment("fortune")) {
                if (fortuneLevel == 3) {
                    data.block.dimension.runCommandAsync('execute positioned '+ block_location_x + " "+ block_location_y + " "+ block_location_z +' run loot spawn ~~~ loot \"poke/blocks/'+ blockid +'\"')
                    data.block.dimension.runCommandAsync('execute positioned '+ block_location_x + " "+ block_location_y + " "+ block_location_z +' run loot spawn ~~~ loot \"poke/blocks/'+ blockid +'\"')
                    data.block.dimension.runCommandAsync('execute positioned '+ block_location_x + " "+ block_location_y + " "+ block_location_z +' run loot spawn ~~~ loot \"poke/blocks/'+ blockid +'\"')
                    return;
                }
                if (fortuneLevel == 2) {
                    data.block.dimension.runCommandAsync('execute positioned '+ block_location_x + " "+ block_location_y + " "+ block_location_z +' run loot spawn ~~~ loot \"poke/blocks/'+ blockid +'\"')
                    data.block.dimension.runCommandAsync('execute positioned '+ block_location_x + " "+ block_location_y + " "+ block_location_z +' run loot spawn ~~~ loot \"poke/blocks/'+ blockid +'\"')
                    return;
                }
                if (fortuneLevel == 1) {
                    data.block.dimension.runCommandAsync('execute positioned '+ block_location_x + " "+ block_location_y + " "+ block_location_z +' run loot spawn ~~~ loot \"poke/blocks/'+ blockid +'\"')
                    return;
                }
                return;
            }
            return;
        }
        return;
    }
}
//Slab combining & Double slab loot
class PFESlabs {
    onPlayerInteract(data) {
        var block_location_x = data.block.x
        var block_location_y = data.block.y
        var block_location_z = data.block.z
        const slabid = data.block.typeId
        const mainhand = data.player.getComponent(EntityComponentTypes.Equippable).getEquipment('Mainhand')
        if (mainhand != undefined){
            if (mainhand.typeId == slabid && data.face == 'Up') {
                data.block.setPermutation(data.block.permutation.withState('poke:double',true))
                data.block.dimension.runCommandAsync('playsound use.stone @a '+ block_location_x + ' '+ block_location_y+' '+ block_location_z)
                return;
            }
            else {
                return
            }
        }
        return;
    }
    onPlayerDestroy(data){
        const block_location = data.block.location
        const gm = data.player.getGameMode()
        const blockid = data.destroyedBlockPermutation.type.id
        const blockstate = data.destroyedBlockPermutation.getState('poke:double')
        if (gm == 'survival') {
            if (blockstate == true) {
                data.dimension.spawnItem
                (new ItemStack(blockid, 1),block_location)
                return;
            }
            return;
        }
        return;
    }
}
//Phantomic Conduit's ability
class PFEPhantomicConduit {
    onTick(data) {
        var block_location_x = data.block.x
        var block_location_y = data.block.y
        var block_location_z = data.block.z
        if (data.block.getRedstonePower() != 0 && data.block.getRedstonePower() !== undefined) {
        data.dimension.runCommand('execute positioned '+block_location_x+' '+block_location_y+' '+block_location_z+' as @e[r=50,family=phantom] run damage @s 20')
        return;
        }
        return;
    }
}
class PFEDAConduit {
    onTick(data) {
        const block_location = data.block.x + ' '+ data.block.y + ' '+ data.block.z
        if (data.block.getRedstonePower() != 0 && data.block.getRedstonePower() !== undefined) {
        data.dimension.runCommand('execute positioned '+block_location+' as @e[r=50,family=pfe:demonic_allay] run damage @s 20')
        return;
        }
        return;
    }
}

//Cobblestone Generator's ability
class PFECobbleGen {
    onTick(data) {
        var block_location_x = data.block.x
        var block_location_y = data.block.y
        var block_location_z = data.block.z
        if (data.block.getRedstonePower() != 0 && data.block.getRedstonePower() !== undefined) {
            data.dimension.runCommand('execute positioned '+block_location_x+' '+block_location_y+' '+block_location_z+' if block ~ ~1 ~ air run setblock ~ ~1 ~ cobblestone')
            return;
        }
        return;
    }
}
//Cobbler's ability
class PFECobbler {
    onTick(data) {
        var block_location_x = data.block.x
        var block_location_y = data.block.y
        var block_location_z = data.block.z
        if (data.block.getRedstonePower() != 0 && data.block.getRedstonePower() !== undefined) {
            data.dimension.runCommand('execute positioned '+block_location_x+' '+block_location_y+' '+block_location_z+' run structure load poke:cobblestone_item ~ ~-1 ~')
            return;
        }
        return;
    }
}
//Block Breaker's ability
class PFEBlockBreaker {
    onTick(data) {
        var block_location_x = data.block.x
        var block_location_y = data.block.y
        var block_location_z = data.block.z
        if (data.block.getRedstonePower() != 0 && data.block.getRedstonePower() !== undefined) {
            data.dimension.runCommand('execute positioned '+block_location_x+' '+block_location_y+' '+block_location_z+' unless block ~ ~-1 ~ bedrock run setblock ~ ~-1 ~ air destroy')
            return;
        }
        return;
    }
}
//Dirter's ability
class PFEDirter{
    onTick(data) {
        if (data.block.getRedstonePower() != 0 && data.block.getRedstonePower() !== undefined && data.block.below().typeId == 'minecraft:cobblestone') {
            data.block.below().setType('minecraft:dirt')
            return;
        }
        return;
    }
}
//Duster's ability
class PFEDuster {
    onTick(data) {
        if (data.block.getRedstonePower() != 0 && data.block.getRedstonePower() !== undefined) {
            if (data.block.below().typeId == 'minecraft:dirt') {
                data.block.below().setType('minecraft:sand')
                return;
            }
            if (data.block.below().typeId == 'minecraft:cobblestone') {
                data.block.below().setType('minecraft:gravel')
                return;
            }
            return;
        }
    }
}
//Magnet(Block)'s ability
class PFEMagnetBlock{
    onTick(data) {
        const block_location = data.block.x + ' '+ data.block.y + ' '+ data.block.z
        if (data.block.getRedstonePower() != 0 && data.block.getRedstonePower() !== undefined) {
            data.dimension.runCommand('execute positioned '+block_location+' as @e[type=item,r=10] run tp @s '+ block_location)
            return;
        }
        return;
    }
}
//Bulb Light Color 
class PFEBulbs{
    onPlayerInteract(data) {
        var block_location_x = data.block.x
        var block_location_y = data.block.y
        var block_location_z = data.block.z
        var light_color = data.block.permutation.getState('pfe:color')
        var sound_pitch = 1 + light_color / 10
        if (data.block.permutation.hasTag('pfe:color') == 15) {
            data.block.setPermutation(data.block.permutation.withState('pfe:color',0))
            data.block.dimension.runCommandAsync('playsound block.copper_bulb.turn_on @a '+ block_location_x + ' '+ block_location_y+' '+ block_location_z + ' 1 ' + sound_pitch)
            return;
        }
        else {
            data.block.setPermutation(
            data.block.permutation.withState('pfe:color',light_color + 1))
            data.block.dimension.runCommandAsync('playsound block.copper_bulb.turn_on @a '+ block_location_x + ' '+ block_location_y+' '+ block_location_z + ' 1 ' + sound_pitch)
            return;
        }
    }
}
//Calibrate Blocks
class PFECalibrate {
    onPlayerInteract(data) {
        const bid = data.block.typeId
        const blockid = bid.substring(0,bid.lastIndexOf("_"))
        const blockface = data.face
        if (blockface == 'East') {
            data.block.setType(blockid+'_east')
            return;
        }
        if (blockface == 'West') {
            data.block.setType(blockid+'_west')
            return;
        }
        if (blockface == 'North') {
            data.block.setType(blockid+'_north')
            return;
        }
        if (blockface == 'South') {
            data.block.setType(blockid+'_south')
            return;
        }
        return;
    }
}
//Calibrated Block Breakers
class PFECBlockBreaker {
    onTick(data) {
        var block_location_x = data.block.x
        var block_location_y = data.block.y
        var block_location_z = data.block.z
        if (data.block.getRedstonePower() != 0 && data.block.getRedstonePower() !== undefined) {
            if (data.block.typeId == 'poke:block_breaker_east') {  
                data.dimension.runCommand('execute positioned '+block_location_x+' '+block_location_y+' '+block_location_z+' unless block ~1 ~ ~ bedrock run setblock ~1 ~ ~ air destroy')
                return;
            }
            if (data.block.typeId == 'poke:block_breaker_west') {  
                data.dimension.runCommand('execute positioned '+block_location_x+' '+block_location_y+' '+block_location_z+' unless block ~-1 ~ ~ bedrock run setblock ~-1 ~ ~ air destroy')
                return;
            }
            if (data.block.typeId == 'poke:block_breaker_south') {  
                data.dimension.runCommand('execute positioned '+block_location_x+' '+block_location_y+' '+block_location_z+' unless block ~ ~ ~1 bedrock run setblock ~ ~ ~1 air destroy')
                return;
            }
            if (data.block.typeId == 'poke:block_breaker_north') {  
                data.dimension.runCommand('execute positioned '+block_location_x+' '+block_location_y+' '+block_location_z+' unless block ~ ~ ~-1 bedrock run setblock ~ ~ ~-1 air destroy')
                return;
            }
            return;
        }
        return;
    }
}
//Calibrated Cobble Gens 
class PFECCobbleGen {
    onTick(data) {
        var block_location_x = data.block.x
        var block_location_y = data.block.y
        var block_location_z = data.block.z
        if (data.block.getRedstonePower() != 0 && data.block.getRedstonePower() !== undefined) {
            if (data.block.typeId == 'poke:calibrated_cobblestone_generator_east') {  
                data.dimension.runCommand('execute positioned '+block_location_x+' '+block_location_y+' '+block_location_z+' if block ~1 ~ ~ air run setblock ~1 ~ ~ cobblestone')
                return;
            }
            if (data.block.typeId == 'poke:calibrated_cobblestone_generator_west') {  
                data.dimension.runCommand('execute positioned '+block_location_x+' '+block_location_y+' '+block_location_z+' if block ~-1 ~ ~ air run setblock ~-1 ~ ~ cobblestone')
                return;
            }
            if (data.block.typeId == 'poke:calibrated_cobblestone_generator_south') {  
                data.dimension.runCommand('execute positioned '+block_location_x+' '+block_location_y+' '+block_location_z+' if block ~ ~ ~1 air run setblock ~ ~ ~1 cobblestone')
                return;
            }
            if (data.block.typeId == 'poke:calibrated_cobblestone_generator_north') {  
                data.dimension.runCommand('execute positioned '+block_location_x+' '+block_location_y+' '+block_location_z+' if block ~ ~ ~-1 air run setblock ~ ~ ~-1 cobblestone')
                return;
            }
            return;
        }
        return;
    }
}
//Crops
class PFECrop{
    onRandomTick(data) {
        var growth_state = data.block.permutation.getState('poke:growth_stage')
        var growth_stage = growth_state +1
        if (growth_state != undefined || 6){
            data.block.setPermutation(data.block.permutation.withState('poke:growth_stage',growth_stage))
            return;
        }
        return;
    }  
    onPlayerInteract(data) {
        const block_location = data.block.x + ' '+ data.block.y + ' '+ data.block.z
        const mainhand = data.player.getComponent(EntityComponentTypes.Equippable).getEquipment('Mainhand')
        var growth_state = data.block.permutation.getState('poke:growth_stage')
        var growth_stage = growth_state +(1,2,3)
        var itemafteruse = mainhand.amount
        var itemafteruse1 = itemafteruse -1
        if (growth_stage > 6){
            var growth_stage = 6
        }
        if (mainhand.typeId == 'minecraft:bone_meal' && growth_state != 6) {
            data.block.setPermutation(data.block.permutation.withState('poke:growth_stage',growth_stage))
            data.dimension.runCommand("playsound item.bone_meal.use @a "+block_location)
            data.dimension.runCommand("particle minecraft:crop_growth_emitter "+ block_location)
            if(data.player.getGameMode != 'creative') {
                if (itemafteruse1 == 0){
                    data.player.runCommand('clear @s bone_meal 0 1')
                    return;
                }
                data.player.getComponent(EntityComponentTypes.Equippable).setEquipment('Mainhand', new ItemStack(mainhand.typeId,itemafteruse1))
                return;
            }
            return
        }
        return;
    }
}
//Lava Sponge
class PFELavaSponge{
    onTick(data) {
        const block_location = data.block.x + ' '+ data.block.y + ' '+ data.block.z
        data.dimension.runCommand('execute positioned '+block_location+' run function poke/blocks/lava_sponge')
        return;
    }
}
class PFEBarometer{
    onTick(data) {
        var weather = data.block.permutation.getState('pfe:weather')
        if (data.block.getRedstonePower() != 0 && data.block.getRedstonePower() !== undefined) {
            if (data.dimension.getWeather() == 'Clear' && weather != 0){
                data.block.setPermutation(data.block.permutation.withState('pfe:weather',0))
                return;
            }
            if (data.dimension.getWeather() != 'Thunder' && data.dimension.getWeather() == 'Rain' && weather != 1){
            data.block.setPermutation(data.block.permutation.withState('pfe:weather',1))
            return;
            }
            if (data.dimension.getWeather() == 'Thunder' && weather != 2){
                data.block.setPermutation(data.block.permutation.withState('pfe:weather',2))
                return;
            }
            return;
        }
    }
}
//Cassettes
class PFECassette {
    onUse(data){
        const id = data.itemStack.typeId
        const trackid = id.substring(id.lastIndexOf("_")).substring(1)
        data.source.playMusic('poke.record.'+trackid,{fade:2.5})
        data.source.playSound('poke.cassette_activate')
        return;
    }
}
//Runs the command listed as a tag on the item used & Takes durability (with unbreaking in mind) if applicable
class PFEOnUse {
    onUse(data){
        const id = data.itemStack.getTags()
        data.source.runCommand(''+id)
        if (data.source.getGameMode() == 'creative') return;
        const newItem = damage_item(data.itemStack)
        data.source.getComponent(EntityComponentTypes.Equippable).setEquipment(EquipmentSlot.Mainhand, newItem)
        return;
    }
}
//Upgrader
class PFEUpgrader {
    onUseOn(data){
        const block_location = data.block.x +' '+data.block.y+' '+data.block.z
        const itemids = data.itemStack.typeId
        const itemid = itemids.substring(5)
        data.source.runCommandAsync('execute positioned '+block_location+' run function pfe_items/upgraders/'+ itemid)
        if (data.source.getGameMode() == 'creative') return;
        const newItem = damage_item(data.itemStack)
        data.source.getComponent(EntityComponentTypes.Equippable).setEquipment(EquipmentSlot.Mainhand, newItem)
        return;
    }
}
//Custom Component Registery (may warn about a spike on world loaing because of how many components)
world.beforeEvents.worldInitialize.subscribe(event => {
    event.itemComponentRegistry.registerCustomComponent(
        "poke:cas", new PFECassette()
    );
    event.itemComponentRegistry.registerCustomComponent(
        "poke:cc_on_use", new PFEOnUse()
    );
    event.blockTypeRegistry.registerCustomComponent(
        "poke:trapdoor_event", new PFETrapdoor()
    );
    event.blockTypeRegistry.registerCustomComponent(
        "poke:fortune", new PFEFortune()
    );
    event.blockTypeRegistry.registerCustomComponent(
        "poke:slabs", new PFESlabs()
    );
    event.blockTypeRegistry.registerCustomComponent(
        "poke:cc_bulbs", new PFEBulbs()
    );
    event.blockTypeRegistry.registerCustomComponent(
        "poke:cc_phantomic_conduit", new PFEPhantomicConduit()
    );
    event.blockTypeRegistry.registerCustomComponent(
        "poke:cc_da_conduit", new PFEDAConduit()
    );
    event.blockTypeRegistry.registerCustomComponent(
        "poke:cc_cobble_gen", new PFECobbleGen()
    );
    event.blockTypeRegistry.registerCustomComponent(
        "poke:cc_cobbler", new PFECobbler()
    );
    event.blockTypeRegistry.registerCustomComponent(
        "poke:cc_block_breaker", new PFEBlockBreaker()
    );
    event.blockTypeRegistry.registerCustomComponent(
        "poke:cc_dirter", new PFEDirter()
    );
    event.blockTypeRegistry.registerCustomComponent(
        "poke:cc_duster", new PFEDuster()
    );
    event.blockTypeRegistry.registerCustomComponent(
        "poke:cc_magnet_block", new PFEMagnetBlock()
    );
    event.blockTypeRegistry.registerCustomComponent(
        "poke:cc_calibrate", new PFECalibrate()
    );
    event.blockTypeRegistry.registerCustomComponent(
        "poke:cc_cblock_breaker", new PFECBlockBreaker()
    );
    event.blockTypeRegistry.registerCustomComponent(
        "poke:cc_ccobble_gen", new PFECCobbleGen()
    );
    event.blockTypeRegistry.registerCustomComponent(
        "poke:crops", new PFECrop()
    );
    event.blockTypeRegistry.registerCustomComponent(
        "poke:cc_barometer", new PFEBarometer()
    );
    event.blockTypeRegistry.registerCustomComponent(
        "poke:cc_lava_sponge", new PFELavaSponge()
    );
    event.itemComponentRegistry.registerCustomComponent(
        "poke:cc_upgrader", new PFEUpgrader()
    );
    return;
})
