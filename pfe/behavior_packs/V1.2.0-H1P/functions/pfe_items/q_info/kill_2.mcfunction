execute unless entity @s[hasitem=[{item=minecraft:string,quantity=4..},{item=minecraft:rotten_flesh,quantity=4..}]] run playsound poke.quest.info @s
tellraw @s {"rawtext":[{"text":"----------------§6\n§lQuest§r§6§r:\n- Gather §3§l4§r§3§r String\n- Gather §3§l4§r§3§r Rotten Flesh\n§l§aReward§r§l§r:\n- §3§l2§r§3§r §6Copper Tokens\n§r----------------"}]}
execute if entity @s[hasitem=[{item=minecraft:string,quantity=4..},{item=minecraft:rotten_flesh,quantity=4..}]] run function poke/quest/kill_2