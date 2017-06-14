package model.data;

import com.database.model.DbCol;
import com.database.model.Repository_old;
import com.utils.date.TDate;
import java.util.UUID;

public class CryptKey extends Repository_old<CryptKey, Integer> {

    @DbCol
    public final Col<Integer> id = column(Integer.class, "ID").primaryKey();
    @DbCol
    public final Col<UUID> uid = column("UID");
    @DbCol
    public final Col<TDate> created = column("Utworzono");
    @DbCol
    public final Col<Integer> userId = column("Użytkownik");
    @DbCol
    public final Col<String> serviceKey = column("Klucz usługi");
    @DbCol
    public final Col<String> userKey = column("Klucz użytkownika");
    @DbCol
    public final Col<String> md5 = column("MD5");

    public CryptKey(Integer id) {
        super("cryptKey", "data.crypt_key", "Klucz szyfrujący", id);
        init();
    }

}
