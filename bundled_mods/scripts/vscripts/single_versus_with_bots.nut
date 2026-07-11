function OnGameEvent_player_death(params)
{
	PlayerLoop();
}

function OnGameEvent_player_left_start_area(params)
{
	PlayerLoop();
}

function PlayerLoop()
{
	local player = null;
	while ( player = Entities.FindByClassname(player, "player") )
	{
		if(!IsPlayerABot(player))
		{
			AddThinkToPlayer( player );
			return;
		}
	}
}

function AddThinkToPlayer( player )
{
	if( player.ValidateScriptScope() )
	{
		local scope = player.GetScriptScope();
		scope["Think"] <- function()
		{
			if( player.IsDead() || player.IsGhost() ) 
			{
				ZSpawn({type = 3});
				return;
			}
		}
		if(!player.IsSurvivor())
			AddThinkToEnt(player, "Think")
	}
}
