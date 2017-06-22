package model.repository;

import com.model.repository.Column;
import com.model.repository.ForeignColumn;
import com.model.repository.ForeignColumns;
import com.model.repository.Repository;
import com.utils.date.TDate;
import com.utils.reflections.datatype.DataType;
import java.util.UUID;

public class RCategory extends Repository<Integer> {

    public final static Column<Integer> ID = new Column<>(c -> {
        c.repository = RCategory.class;
        c.type = DataType.INT;
        c.readOnly = true;
        c.key = "id";
        c.name = "ID";
    });

    public final static Column<UUID> UID = new Column<>(c -> {
        c.repository = RCategory.class;
        c.type = DataType.UUID;
        c.required = true;
        c.readOnly = true;
        c.unique = true;
        c.autoGenerated = true;
        c.key = "uid";
        c.name = "UID";
    });

    public final static Column<String> KEY = new Column<>(c -> {
        c.repository = RCategory.class;
        c.type = DataType.KEY;
        c.required = true;
        c.key = "key";
        c.name = "Klucz";
    });

    public final static Column<TDate> CREATED = new Column<>(c -> {
        c.repository = RCategory.class;
        c.type = DataType.TIMESTAMP;
        c.key = "created";
        c.required = true;
        c.autoGenerated = true;
        c.key = "created";
        c.name = "Utworzono";
    });

    public final static Column<String> NAME = new Column<>(c -> {
        c.repository = RCategory.class;
        c.type = DataType.STRING;
        c.required = true;
        c.key = "name";
        c.name = "Nazwa";
    });

    public final static Column<String> DESC = new Column<>(c -> {
        c.repository = RCategory.class;
        c.type = DataType.MEMO;
        c.key = "desc";
        c.daoName = "description";
        c.name = "Opis";
    });

    public final static Column<Integer> ICON = new Column<>(c -> {
        c.repository = RCategory.class;
        c.type = DataType.INT;
        c.key = "icon";
        c.name = "Ikona";
    });

    public final static ForeignColumns<Integer, RCategory> CATS = new ForeignColumns<>(c -> {
        c.repository = RCategory.class;
        c.type = DataType.INT.asArray();
        c.daoName = "categories";
        c.key = "cats";
        c.name = "Kategorie";
    }, RCategory.ID);

    public final static ForeignColumn<Integer, RAttribute> ATTRS = new ForeignColumn<>(c -> {
        c.repository = RCategory.class;
        c.type = DataType.INT;
        c.daoName = "attributes";
        c.key = "attr";
        c.name = "Dozwolone atrybuty";
    }, RAttribute.ID);

    public RCategory() {
        super(c -> {
            c.key = "category";
            c.daoName = "data.category";
            c.name = "Kategoria";
            c.primaryKey = ID;
        });
    }

}
