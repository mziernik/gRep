package model.data;

import com.database.model.DbCol;
import com.database.model.Repository_old;
import com.utils.Utils;
import com.utils.date.TDate;
import java.util.UUID;

public class Catalog extends Repository_old<Catalog, Integer> {

    @DbCol
    public final Col<Integer> id = column(Integer.class, "ID").primaryKey();
    @DbCol
    public final Col<UUID> uid = column("UID");
    @DbCol
    public final Col<Integer> index = column(Integer.class, "Kolejność");
    @DbCol
    public final Col<Integer> category = column("Definicja");
    @DbCol
    public final Col<TDate> created = column("Utworzono");
    @DbCol
    public final Col<String> name = column("Nazwa");
    @DbCol
    public final Col<String> description = column("Opis");
    @DbCol
    public final Col<Boolean> _abstract = column("Abstrakcyjne");
    @DbCol
    public final ColF<Integer, Catalog> parent = columnF("Rodzic");
    @DbCol
    public final ColF<Integer[], Attribute_old> attributes = columnF("Dozwolone atrybuty");

    public Catalog(Integer id) {
        super("catalog", "data.catalog", "Katalog", id);
        orderColumns.add(parent, true);
        orderColumns.add(index, true);
        init();
    }

    @Override
    protected int compare(Catalog other) {
        Integer i1 = Utils.coalesce(this.index.get(), 0);
        Integer p1 = Utils.coalesce(this.parent.get(), 0);
        Integer i2 = Utils.coalesce(other.index.get(), 0);
        Integer p2 = Utils.coalesce(other.parent.get(), 0);
        return (p1 * 1000 + i1) - (p2 * 1000 + i2);
    }

}
