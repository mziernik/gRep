package main.handlers;

import com.config.engine.ConfigException;
import com.config.engine.ConfigField;
import com.config.engine.HConfig;
import com.config.engine.ValueSource;
import com.database.QueryRow;
import com.json.JArray;
import com.json.JElement;
import com.json.JSON;
import com.mlogger.Log;
import com.utils.Unquoted;
import java.util.logging.Level;
import java.util.logging.Logger;
import model.Db;

public class Config extends HConfig {

    @Override
    protected boolean hasExternalDb() {
        return true;
    }

    @Override
    protected void loadExternalDbConfig() throws Exception {

        for (QueryRow row : new Db().execute("SELECT * FROM config"))
            try {
                ConfigField<?, ?, ?> field = getFieldF(row.getStr("key"));

                if (!externalDB(field))
                    continue;

                JElement el = JSON.parse(row.getStr("value", null));

                field.store().set(true,
                        row.getBool("default"),
                        row.getStr("variable", null),
                        el);

            } catch (Exception e) {
                Log.error(e);
                Logger.getLogger("").log(Level.SEVERE, null,
                        new ConfigException(row.getStr("key"), e));
            }
    }

    @Override
    public void save(ConfigField field) throws Exception {
        super.save(field);

        if (field == null || !externalDB(field))
            return;

        Db db = new Db();

        QueryRow row = db.execute("SELECT * FROM config WHERE key = ?", field.getKey()).first();

        JArray jvalue = field.store().getValuesArray(ValueSource.USER);
        jvalue.options.compactMode(true);
        String value = jvalue.toString();

        db.insertOrUpdate("CONFIG", row == null ? null : "config_id = " + row.getInt("config_id"))
                .arg("key", field.getKey())
                .arg("value", value)
                //   .arg("variable", field.variable())
                .arg("\"default\"", field.isDefaultState())
                .arg("last_modified", new Unquoted("now()"))
                .execute();
    }

}
