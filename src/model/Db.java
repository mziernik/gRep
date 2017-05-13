package model;

import com.database.model.DbRecordTransaction;
import com.config.engine.ConfigNode;
import com.config.engine.HConfig;
import com.config.engine.field.CfPassword;
import com.config.engine.field.CfString;
import com.context.intf.ContextInitialized;
import com.database.*;
import com.database.drivers.postgresql.PostgreSQL;
import com.mlogger.Log;
import com.utils.collections.TList;
import java.sql.*;
import com.config.engine.interfaces.Cfg;
import com.database.model.DsTable;
import static com.lang.LConfig.*;
import com.utils.Unquoted;
import main.GRep;
import model.data.Attribute;
import model.data.AttributeElement;
import model.data.CatalogAttribute;
import model.data.CryptKey;
import model.data.CategoryAttribute;
import model.data.Category;
import model.data.Catalog;
import model.data.Resource;

public class Db extends PostgreSQL {

    static {
        DsTable.registerRecords(CategoryAttribute.class);
        DsTable.registerRecords(AttributeElement.class);
        DsTable.registerRecords(CatalogAttribute.class);
        DsTable.registerRecords(Resource.class);
        DsTable.registerRecords(Attribute.class);
        DsTable.registerRecords(Category.class);
        DsTable.registerRecords(Catalog.class);
        DsTable.registerRecords(CryptKey.class);
    }

//    public final static Files files = new Files();
    //   public final static Documents documents = new Documents();
    public static class CDatabase extends ConfigNode {

        public CDatabase() {
            super(HConfig.class, "database", DATABASE);
            externalDB(false); // nie zapisuj konfiguracji w postgresie
        }

        @Cfg
        public final static CfString host = new CfString("host",
                HOST, "XXX127.0.0.1:5432");

        @Cfg
        public final static CfString dbName = new CfString("db_name",
                DB_NAME, "grep");

        @Cfg
        public final static CfString user = new CfString("user",
                USER, "postgres");

        @Cfg
        public final static CfPassword pass = new CfPassword("pass",
                PASS, "postgres");
    }

    public Db() {
        super(GRep.unitTestMode
                // na potrzeby testów jednostkowych
                ? new DBConnectionData(PostgreSQL.class, "PostgreSQL",
                        "localhost/unit_test")
                        .property("user", "postgres")
                        .property("password", "postgres")
                : new DBConnectionData(PostgreSQL.class, "PostgreSQL",
                        CDatabase.host.value() + "/"
                        + CDatabase.dbName.value())
                        .property("user", CDatabase.user.value())
                        .property("password", CDatabase.pass.value())
        );
    }

    // na potrzeby testów jednostkowych
    protected Db(DBConnectionData connData) {
        super(connData);
    }

    /*
        protected void onCreate(Database db) throws SQLException, JException {
        String adminPass = AppConfig.json.objectF("release").getStr("admin_pass");

        db.update("users.users", "username = 'admin'")
                .arg("password", adminPass)
                .execute();
    }
     */
    @Override
    protected void initialize() throws SQLException {
        super.initialize();

        TList<String> databases = new TList<>();

        boolean newDatabase = false;
        try (Connection connection = DriverManager.getConnection("jdbc:postgresql://"
                + CDatabase.host.value() + "/postgres", CDatabase.user.value(), CDatabase.pass.value())) {
            PreparedStatement ps = connection
                    .prepareStatement("SELECT datname FROM pg_database WHERE datistemplate = false;");
            ResultSet rs = ps.executeQuery();
            while (rs.next())
                databases.add(rs.getString(1));
            rs.close();
            ps.close();

            if (!databases.contains(CDatabase.dbName.value())) {
                newDatabase = true;
                Log.info("Baza " + CDatabase.dbName.value() + " nie istnieje. Tworzę nową");
                Statement statement = connection.createStatement();
                statement.executeUpdate("CREATE DATABASE " + CDatabase.dbName.value());
            }
        }

        new DbStructure(Db.class, "/META-INF/db/database.conf") {
            @Override
            protected void updateInfo(Database db, int rev, boolean create) throws Exception {
                db.insertOrUpdate("meta_data", create ? null : "key = 'db.date'")
                        .argIns("key", "db.date")
                        .argIns("name", "Data utworzenia")
                        .arg("value", new Unquoted("to_char(now(), 'yyyy-mm-dd HH24:mm:ss')"))
                        .execute();

                db.insertOrUpdate("meta_data", create ? null : "key = 'db.revision'")
                        .argIns("key", "db.revision")
                        .argIns("name", "Wersja bazy")
                        .arg("value", rev)
                        .execute();

            }

        }.process(newDatabase);

    }

    @ContextInitialized(async = true, ignoreErrors = true)
    private static void synchronize() throws Exception {
        // DbModel_old.init(Db::new);
        DsTable.updateAll(Db::new);
/*
        DbRecordTransaction trans = new DbRecordTransaction();

        AttributeElement elm = new AttributeElement(1);
        trans.set(elm.description, "Opis 1");
        trans.set(elm.name, "Nazwa 1");

        elm = elm = new AttributeElement(5);
        trans.set(elm.description, "Opis 2");
        trans.set(elm.name, "Nazwa 2");

        elm = new AttributeElement(null);
        trans.set(elm.key, "NewKey");
        trans.set(elm.type, "B");
        trans.set(elm.description, "Opis X");
        trans.set(elm.name, "Nazwa X");

        trans.delete(new AttributeElement(9));
        trans.commit(new Db());*/
    }
}
