package main.handlers;

import com.database.Database;
import com.database.DbHandler;
import model.Db;

public class DbHnd extends DbHandler {

    @Override
    public Database getDatabase() {
        return new Db();
    }

}
