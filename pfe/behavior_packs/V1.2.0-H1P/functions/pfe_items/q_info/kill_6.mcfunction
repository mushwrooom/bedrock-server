execute unless entity @s[hasitem=[{item=minecraft:skull,data=1,quantity=1..}]] run playsound poke.quest.info @s
tellraw @s {"rawtext":[{"text":"----------------§6\n§lQuest§r§6§r:\n- Gather §3§l1§r§3§r Wither Skeleton Skull\n§l§aReward§r§l§r:\n- §3§l1§r§3§r §eGold Token\n§r----------------"}]}
execute if entity @s[hasitem=[{item=minecraft:skull,data=1,quantity=1..}]] run function poke/quest/kill_6