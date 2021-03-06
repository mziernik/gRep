package model.repository.catalog;

import model.repository.catalog.RCatalog;
import model.repository.attribute.RAttribute;
import com.model.repository.Column;
import com.model.repository.ForeignColumn;
import com.model.repository.Repository;
import com.utils.date.TDate;
import com.utils.reflections.datatype.DataType;
import java.util.UUID;

public class RCatalogAttribute extends Repository<Integer> {

    public final static Column<Integer> ID = new Column<>(c -> {
        c.repository = RCatalogAttribute.class;
        c.type = DataType.INT;
        c.readOnly = true;
        c.unique = true;
        c.autoGenerated = true;
        c.key = "id";
        c.name = "ID";
        c.hidden = true;
    });

    public final static Column<UUID> UID = new Column<>(c -> {
        c.repository = RCatalogAttribute.class;
        c.type = DataType.UUID;
        c.readOnly = true;
        c.autoGenerated = true;
        c.unique = true;
        c.key = "uid";
        c.name = "UID";
        c.hidden = true;
    });

    public final static Column<TDate> CREATED = new Column<>(c -> {
        c.repository = RCatalogAttribute.class;
        c.type = DataType.TIMESTAMP;
        c.readOnly = true;
        c.autoGenerated = true;
        c.key = "created";
        c.name = "Utworzono";
        c.hidden = true;
    });

    public final static ForeignColumn<Integer, RCatalog> CATALOG = new ForeignColumn<>(c -> {
        c.repository = RCatalogAttribute.class;
        c.type = DataType.INT;
        c.key = "cat";
        c.required = true;
        c.daoName = "catalog";
        c.name = "Katalog";
    }, RCatalog.ID);

    public final static ForeignColumn<Integer, RAttribute> ATTR = new ForeignColumn<>(c -> {
        c.repository = RCatalogAttribute.class;
        c.type = DataType.INT;
        c.daoName = "attribute";
        c.key = "attr";
        c.name = "Atrybut";
    }, RAttribute.ID);

    public final static Column<Integer> ORDER = new Column<>(c -> {
        c.repository = RCatalogAttribute.class;
        c.type = DataType.INT;
        c.key = "order";
        c.daoName = "index";
        c.name = "Kolejność";
    });

    public final static Column<String> NOTES = new Column<>(c -> {
        c.repository = RCatalogAttribute.class;
        c.type = DataType.MEMO;
        c.key = "notes";
        c.name = "Notatki";
        c.hidden = true;
    });
//    
//    public final static Column<Boolean> abstract_= new Column<>(c -> {"Abstrakcyjny"});

    public RCatalogAttribute() {
        super(c -> {
            c.key = "catalogAttr";
            c.daoName = "data.catalog_attribute";
            c.name = "Atrybut katalogu";
            c.group = "Katalogi";
            //  c.reference("Wartości", RCatalogAttributeValues.ATTR);
            c.primaryKey = ID;
            c.displayName = ATTR;
            c.order(CATALOG, true);
            c.order(ORDER, true);
        });
    }
    /*
    @Override
    protected int compare(CatalogAttribute other) {
        Integer i1 = Utils.coalesce(this.index.get(), 0);
        Integer p1 = Utils.coalesce(this.catalog.get(), 0);
        Integer i2 = Utils.coalesce(other.index.get(), 0);
        Integer p2 = Utils.coalesce(other.catalog.get(), 0);
        return (p1 * 1000 + i1) - (p2 * 1000 + i2);
    }
     */
}
