package model.data;

import com.database.model.DbCol;
import com.database.model.DsTable;
import com.utils.collections.Strings;
import com.utils.date.TDate;
import java.util.UUID;

public class Resource extends DsTable<Resource, Integer> {

    @DbCol
    public final Col<Integer> id = column(Integer.class, "ID").primaryKey();
    @DbCol
    public final Col<UUID> uid = column("UID");
    @DbCol
    public final Col<TDate> created = column("Utworzono");
    @DbCol
    public final Col<String> type = column("Typ");
    @DbCol
    public final Col<String> name = column("Nazwa");
    @DbCol
    public final Col<String> description = column("Opis");
    @DbCol
    public final Col<String> value = column("Wartość");
    @DbCol
    public final Col<String> format = column("Format");
    @DbCol
    public final ColF<Integer, Catalog> catalog = columnF("Katalog");
    @DbCol
    public final Col<String> file = column("Plik");
    @DbCol
    public final Col<Integer> size = column("Rozmiar");
    @DbCol
    public final Col<String> md5 = column("MD5");
    @DbCol
    public final ColF<Integer, CryptKey> cryptKey = columnF("Klucz");
    @DbCol
    public final Col<Strings> tags = column("Tagi");

    public Resource(Integer id) {
        super("resource", "data.resource", "Zasób", id);
        init();
    }

}
