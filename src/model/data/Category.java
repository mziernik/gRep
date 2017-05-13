package model.data;

import com.database.model.DbCol;
import com.database.model.DsTable;
import com.utils.date.TDate;
import java.util.UUID;

public class Category extends DsTable<Category, Integer> {

    @DbCol
    public final Col<Integer> id = column(Integer.class, "ID")
            .primaryKey();
    @DbCol
    public final Col<UUID> uid = column("UID");
    @DbCol
    public final Col<String> key = column("Klucz");
    @DbCol
    public final Col<TDate> created = column("Utworzono");
    @DbCol
    public final Col<String> name = column("Nazwa");
    @DbCol
    public final Col<String> description = column("Opis");
    @DbCol
    public final Col<Integer> icon = column("Ikona");
    @DbCol
    public final ColF<Integer[], Category> categories = columnF("Kategoria");
    @DbCol
    public final ColF<Integer[], Attribute> attributes = columnF("Dozwolone atrybuty");

    public Category(Integer id) {
        super("category", "data.category", "Kategoria", id);
        init();
    }

}
