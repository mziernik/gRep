package model.repository;

import com.model.repository.Column;
import com.model.repository.Repository;
import com.utils.date.TDate;
import com.utils.reflections.DataType;
import java.util.UUID;

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

    public final static Column<Integer> PARENT = new Column<>(c -> {
        c.repository = RAttribute.class;
        c.type = DataType.INT;
        c.key = "parent";
        c.name = "Rodzic";
        c.foreign = RAttribute.ID; //Category
    });

    public final static Column<Integer[]> ELEMENTS = new Column<>(c -> {
        c.repository = RAttribute.class;
        c.type = new DataType.ArrayDataType<>(Integer[].class);
        c.clazz = Integer[].class;
        c.list = true;
        c.key = "elements";
        c.name = "Elementy";
        c.foreign = RAttribute.ID; //AttributeElement
    });

    public final static Column<String[]> DEF_VAL = new Column<>(c -> {
        c.repository = RAttribute.class;
        c.type = new DataType.ArrayDataType<>(String[].class);
        c.list = true;
        c.daoName = "def_val";
        c.key = "defVal";
        c.name = "Wartość domyślna";
        c.foreign = RAttribute.ID; //AttributeElement
    });

    public final static Column<Boolean> REQUIRED = new Column<>(c -> {
        c.repository = RAttribute.class;
        c.type = DataType.BOOLEAN;
        c.key = "required";
        c.name = "Wymagane";
        c.defaultValue = Boolean.TRUE;
    });

    // ToDo Dodać repozytorium ikon
    public final static Column<String> ICON = new Column<>(c -> {
        c.repository = RAttribute.class;
        c.type = DataType.STRING;
        c.key = "icon";
        c.name = "Ikona";
        c.required = true;
        c.defaultValue = Boolean.TRUE;
    });

    public final static Column<String> NAME = new Column<>(c -> {
        c.repository = RAttribute.class;
        c.type = DataType.STRING;
        c.key = "name";
        c.name = "Nazwa";
        c.required = true;
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
            c.tableName = "data.attribute";
            c.name = "Atrybut";
            c.primaryKey = ID;
        });
    }

}
