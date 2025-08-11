-- config/permissions.lua
Permissions = Permissions or {}

Permissions.Policy = {
    roles = {
        superadmin = { inherits = {}, capabilities = {'*'} },
        admin = {
            inherits = {'moderator'},
            capabilities = {
                'players.spectate','players.spectate.follow','players.tp.bring','players.tp.goto',
                'inventory.give','inventory.take','inventory.view',
                'jobs.set',
                'economy.get','economy.giveCash','economy.setBank',
                'system.restart.queue','system.restart.cancel','system.stats',
                'system.announce',
                'heatmap.snapshot',
                'moderation.kick','moderation.ban.request','moderation.ban.approve'
            }
        },
        moderator = {
            inherits = {},
            capabilities = {
                'players.freeze','players.heal','players.revive',
                'players.list','warnings.create',
                'heatmap.snapshot'
            }
        }
    },
    cooldowns = {
        ['inventory.give'] = 2,
        ['inventory.take'] = 2,
        ['moderation.kick'] = 10,
        ['system.announce'] = 5
    },
    require_reason = {
        ['moderation.kick'] = true,
        ['moderation.ban.request'] = true
    },
    duo_control = {
        ['moderation.ban'] = true,
        ['economy.setBank'] = true
    },
    principals = {
        -- ['license:YOUR_LICENSE_HERE'] = 'superadmin'
    }
}
