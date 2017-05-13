package model.data;

import com.database.model.DbCol;
import com.database.model.DsTable;
import com.utils.Utils;
import com.utils.collections.Strings;
import com.utils.date.TDate;
import java.util.UUID;

public class CatalogAttribute extends DsTable<CatalogAttribute, Integer> {

    @DbCol
    public final Col<Integer> id = column(Integer.class, "ID").primaryKey();
    @DbCol
    public final Col<UUID> uid = column("UID");
    @DbCol
    public final Col<TDate> created = column("Utworzono");
    @DbCol
    public final ColF<Integer, Catalog> catalog = columnF("Katalog");
    @DbCol
    public final ColF<Integer, Attribute> attribute = columnF("Atrybut");
    @DbCol()
    public final Col<Integer> index = column("Kolejność");
    @DbCol(cast = "text[]")
    public final Col<Strings> value = column("Wartość");
    @DbCol
    public final ColF<Integer, CryptKey> cryptKey = columnF("Klucz");
    @DbCol
    public final Col<String> notes = column("Notatki");
//    @DbCol
//    public final Col<Boolean> abstract_ = column("Abstrakcyjny");

    public CatalogAttribute(Integer id) {
        super("catalogAttr", "data.catalog_attribute", "Atrybut katalogu", id);
        orderColumns.add(catalog, true);
        orderColumns.add(index, true);
        init();
    }

    @Override
    protected int compare(CatalogAttribute other) {
        Integer i1 = Utils.coalesce(this.index.get(), 0);
        Integer p1 = Utils.coalesce(this.catalog.get(), 0);
        Integer i2 = Utils.coalesce(other.index.get(), 0);
        Integer p2 = Utils.coalesce(other.catalog.get(), 0);
        return (p1 * 1000 + i1) - (p2 * 1000 + i2);
    }

}
