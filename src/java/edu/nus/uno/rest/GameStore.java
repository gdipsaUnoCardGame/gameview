/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.nus.uno.rest;

import edu.nus.uno.model.Card;
import edu.nus.uno.model.Game;
import edu.nus.uno.model.Player;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;

/**
 *
 * @author Kishore
 */
public class GameStore {

    private static final Map<Integer, JsonObject> gameJsonMap = new LinkedHashMap<>();
    private static final Map<Integer, Game> gameMap = new LinkedHashMap<>();
    private static final AtomicInteger counter = new AtomicInteger(0);
    
    public static Collection<JsonObject> getAll() {
        return gameJsonMap.values();
    }
    
    public static JsonObject get(int id) {
        return gameJsonMap.get(id);
    }
    
    public static JsonObject remove(int id) {
        return gameJsonMap.remove(id);
    }

    public static void removeAll() {
        gameJsonMap.clear();
    }

    public static int create(JsonObject game) {
        final int id = counter.addAndGet(1);

        Game myGame = new Game();
        myGame.createNewGame(""+game.getJsonString("name"));
        
        myGame.changeGameStatus();
        
        gameMap.put(id, myGame);
        
        JsonObject value = Json.createObjectBuilder()
                .add("id", "" + id)
                .add("name", game.getJsonString("name"))
                .add("status", ""+myGame.getStatus()).build();
        
        gameJsonMap.put(id, value);
        return id;
    }
    
     public static JsonObject start(int id) {

        JsonObject game = gameJsonMap.get(id);
        Game myGame = gameMap.get(id);

        // adding 2 dummy players
        myGame.addPlayer("abcd111", "Kishore");
        myGame.addPlayer("xyz111", "Ajay");
        
        //put check to see required players to start game
        
        myGame.changeGameStatus();
        
        System.out.println("testing... \n"+myGame.toString());

        JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
        
        List<Player> players = myGame.getPlayers();
                
        for (Player player : players) {
            
            JsonObject jsonPlayer = Json.createObjectBuilder()
                .add("id", "" + player.getId())
                .add("name", player.getName()).build();
            
            arrayBuilder.add(jsonPlayer);

        }
        
        JsonObject value = Json.createObjectBuilder()
                .add("id", "" + id)
                .add("name", game.getJsonString("name"))
                .add("status", ""+myGame.getStatus())
                .add("players", arrayBuilder).build();
        
        System.out.println("game - "+value.toString());
        
        gameJsonMap.put(id, value);
        return gameJsonMap.get(id);
    }

    


    /**
     * Prevent initialization.
     */
    private GameStore() {
    }
}
