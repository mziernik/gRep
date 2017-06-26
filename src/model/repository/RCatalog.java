package model.repository;

import com.model.repository.Column;
import com.model.repository.ForeignColumn;
import com.model.repository.ForeignColumns;
import com.model.repository.Repository;
import com.utils.date.TDate;
import com.utils.reflections.datatype.DataType;
import java.util.UUID;

public class RCatalog extends Repository<Integer> {

    public final static Column<Integer> ID = new Column<>(c -> {
        c.repository = RCatalog.class;
        c.type = DataType.INT;
        c.key = "id";
        c.name = "ID";
        c.required = true;
        c.readOnly = true;
        c.autoGenerated = true;
        c.unique = true;
    });

    public final static Column<UUID> UID = new Column<>(c -> {
        c.repository = RCatalog.class;
        c.type = DataType.UUID;
        c.key = "uid";
        c.name = "UID";
        c.readOnly = true;
        c.autoGenerated = true;
        c.unique = true;
        c.hidden = true;
    });

    public final static Column<String> NAME = new Column<>(c -> {
        c.repository = RCatalog.class;
        c.type = DataType.STRING;
        c.key = "name";
        c.name = "Nazwa";
        c.required = true;
    });

    public final static Column<Integer> ORDER = new Column<>(c -> {
        c.repository = RCatalog.class;
        c.type = DataType.INT;
        c.daoName = "index";
        c.key = "order";
        c.name = "Kolejność";
    });

    public final static ForeignColumn<Integer, RCatalog> CATEGORY = new ForeignColumn<>(c -> {
        c.repository = RCatalog.class;
        c.type = DataType.INT;
        c.key = "category";
        c.name = "Definicja";
    }, RCatalog.ID);

    public final static Column<TDate> CREATED = new Column<>(c -> {
        c.repository = RCatalog.class;
        c.type = DataType.TIMESTAMP;
        c.key = "created";
        c.name = "Utworzono";
    });

    public final static Column<String> DESC = new Column<>(c -> {
        c.repository = RCatalog.class;
        c.type = DataType.MEMO;
        c.key = "desc";
        c.daoName = "description";
        c.name = "Opis";
    });

    public final static Column<Boolean> ABSTRACT = new Column<>(c -> {
        c.repository = RCatalog.class;
        c.type = DataType.BOOLEAN;
        c.key = "abstract";
        c.name = "Abstrakcyjne";
    });

    public final static ForeignColumn<Integer, RCatalog> PARENT = new ForeignColumn<>(c -> {
        c.repository = RCatalog.class;
        c.type = DataType.INT;
        c.key = "parent";
        c.name = "Rodzic";
    }, RCatalog.ID);

    public final static ForeignColumns<Integer, RAttribute> ATTRIBUTES = new ForeignColumns<>(c -> {
        c.repository = RCatalog.class;
        c.type = DataType.INT.asArray();
        c.key = "attributes";
        c.name = "Dozwolone atrybuty";
    }, RAttribute.ID);

    public RCatalog() {
        super(c -> {
            c.key = "catalog";
            c.daoName = "data.catalog";
            c.name = "Katalog";
            c.primaryKey = ID;
            c.displayName = NAME;
            c.order(PARENT, true);
            c.order(ORDER, true);
        });

    }

    //
    //orderColumns.add(parent, true);
    //        orderColumns.add(index, true);

    /*
    @Override
    protected int compare(Catalog other) {
        Integer i1 = Utils.coalesce(this.index.get(), 0);
        Integer p1 = Utils.coalesce(this.parent.get(), 0);
        Integer i2 = Utils.coalesce(other.index.get(), 0);
        Integer p2 = Utils.coalesce(other.parent.get(), 0);
        return (p1 * 1000 + i1) - (p2 * 1000 + i2);
    }
     */
}