package model.data;

import com.database.QueryRow;
import com.database.model.DbCol;
import com.database.model.DsTable;
import com.model.dataset.DsRecord;
import com.utils.collections.Strings;
import com.utils.date.TDate;
import java.util.UUID;

public class Attribute extends DsTable<Attribute, Integer> {

    @DbCol
    public final Col<Integer> id = column(Integer.class, "ID").primaryKey();
    @DbCol
    public final Col<UUID> uid = column("UID");
    @DbCol
    public final Col<TDate> created = column("Utworzono");
    @DbCol
    public final Col<String> key = column("Klucz");
    @DbCol
    public final ColF<Integer, Category> parent = columnF("Rodzic");
    @DbCol
    public final ColF<Integer[], AttributeElement> elements = columnF("Elementy");
    @DbCol
    public final Col<Strings> defVal = column("Wartość domyślna");
    @DbCol
    public final Col<Boolean> required = column("Wymagane");
    @DbCol
    public final Col<String> icon = column("Ikona");
    @DbCol
    public final Col<String> name = column("Nazwa");
    @DbCol
    public final Col<String> description = column("Opis");

    public Attribute(Integer id) {
        super("attribute", "data.attribute", "Atrybut", id);
        init();
    }

}
