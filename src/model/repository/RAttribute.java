package model.repository;

import com.model.repository.Column;
import com.model.repository.ForeignColumn;
import com.model.repository.ForeignColumns;
import com.model.repository.Record;
import com.model.repository.Repository;
import com.utils.Utils;
import com.utils.date.TDate;
import com.utils.reflections.datatype.DataType;
import java.util.UUID;
import static model.Db.TEST;

public class RAttribute extends Repository<Integer> {

    public final static Column<Integer> ID = new Column<>(c -> {
        c.repository = RAttribute.class;
        c.type = DataType.INT;
        c.key = "id";
        c.name = "ID";
        c.required = true;
        c.autoGenerated = true;
        c.readOnly = true;
        c.unique = true;
    });

    public final static Column<UUID> UID = new Column<>(c -> {
        c.repository = RAttribute.class;
        c.type = DataType.UUID;
        c.key = "uid";
        c.name = "UID";
        c.required = true;
        c.autoGenerated = true;
        c.readOnly = true;
        c.unique = true;
        c.hidden = true;
    });

    public final static Column<TDate> CREATED = new Column<>(c -> {
        c.repository = RAttribute.class;
        c.type = DataType.TIMESTAMP;
        c.key = "created";
        c.name = "Utworzono";
        c.required = true;
        c.autoGenerated = true;
        c.readOnly = true;
    });

    public final static Column<String> KEY = new Column<String>(c -> {
        c.repository = RAttribute.class;
        c.type = DataType.KEY;
        c.key = "key";
        c.name = "Klucz";
        c.unique = true;
        c.required = true;
    });

    public final static Column<String> NAME = new Column<>(c -> {
        c.repository = RAttribute.class;
        c.type = DataType.STRING;
        c.key = "name";
        c.name = "Nazwa";
        c.required = true;
    });

    public final static Column<String> MASK = new Column<>(c -> {
        c.repository = RAttribute.class;
        c.type = DataType.STRING;
        c.key = "mask";
        c.name = "Maska wy swietlania";
        c.hidden = true;
        c.daoName = "display_mask";
    });

    public final static ForeignColumn<Integer, RCategory> PARENT = new ForeignColumn<>(c -> {
        c.repository = RAttribute.class;
        c.type = DataType.INT;
        c.key = "parent";
        c.name = "Rodzic";
    }, RCategory.ID);

    public final static ForeignColumns<Integer, RAttributeElement> ELEMENTS = new ForeignColumns<>(c -> {
        c.repository = RAttribute.class;
        c.type = DataType.INT.asArray();
        c.list = true;
        c.key = "elements";
        c.name = "Elementy";
    }, RAttributeElement.ID);

    public final static Column<String[]> DEF_VAL = new Column<>(c -> {
        c.repository = RAttribute.class;
        c.type = DataType.STRING.asArray();
        c.list = true;
        c.daoName = "def_val";
        c.key = "defVal";
        c.name = "Wartość domyślna";
    });

    public final static Column<Boolean[]> REQUIRED = new Column<>(c -> {
        c.repository = RAttribute.class;
        c.type = DataType.BOOLEAN.asArray();
        c.key = "required";
        c.name = "Wymagane";
    });

    // ToDo Dodać repozytorium ikon
    public final static Column<String> ICON = new Column<>(c -> {
        c.repository = RAttribute.class;
        c.type = DataType.STRING;
        c.key = "icon";
        c.name = "Ikona";
        c.defaultValue = Boolean.TRUE;
    });

    public final static Column<String> DESCRIPTION = new Column<>(c -> {
        c.repository = RAttribute.class;
        c.type = DataType.MEMO;
        c.key = "desc";
        c.daoName = "description";
        c.name = "Opis";
        c.max = 1000;
    });

    public RAttribute() {
        super(c -> {
            c.key = "attribute";
            c.daoName = "data.attribute";
            c.name = "Atrybut";
            c.primaryKey = ID;
            c.displayName = NAME;
        });

    }

}
