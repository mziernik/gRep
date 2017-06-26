package model.repository;

import com.model.repository.Column;
import com.model.repository.Repository;
import com.utils.date.TDate;
import com.utils.reflections.datatype.DataType;
import java.util.UUID;

public class RCryptKey extends Repository<Integer> {

    public final static Column<Integer> ID = new Column<>(c -> {
        c.repository = RCryptKey.class;
        c.type = DataType.INT;
        c.readOnly = true;
        c.unique = true;
        c.autoGenerated = true;
        c.key = "id";
        c.name = "ID";
    });

    public final static Column<UUID> UID = new Column<>(c -> {
        c.repository = RCryptKey.class;
        c.type = DataType.UUID;
        c.required = true;
        c.unique = true;
        c.autoGenerated = true;
        c.key = "uid";
        c.name = "UID";
        c.hidden = true;
    });

    public final static Column<TDate> CREATED = new Column<>(c -> {
        c.repository = RCryptKey.class;
        c.type = DataType.TIMESTAMP;
        c.key = "created";
        c.name = "Utworzono";
        c.readOnly = true;
        c.autoGenerated = true;
    });

    public final static Column<Integer> USER = new Column<>(c -> {
        c.repository = RCryptKey.class;
        c.type = DataType.INT;
        c.key = "user";
        c.name = "Użytkownik";
    });

    public final static Column<String> SERVICE_KEY = new Column<>(c -> {
        c.repository = RCryptKey.class;
        c.type = DataType.PASSWORD;
        c.key = "svrKey";
        c.daoName = "service_key";
        c.name = "Klucz usługi";
    });

    public final static Column<String> USER_KEY = new Column<>(c -> {
        c.repository = RCryptKey.class;
        c.type = DataType.PASSWORD;
        c.key = "userKey";
        c.daoName = "user_key";
        c.name = "Klucz użytkownika";
    });

    public final static Column<String> MD5 = new Column<>(c -> {
        c.repository = RCryptKey.class;
        c.type = DataType.STRING;
        c.key = "md5";
        c.name = "MD5";
    });

    public RCryptKey() {
        super(c -> {
            c.key = "cryptKey";
            c.daoName = "data.crypt_key";
            c.name = "Klucz szyfrujący";
            c.primaryKey = ID;
        });
    }

}