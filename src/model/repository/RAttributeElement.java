package model.repository;

import com.model.repository.Column;
import com.model.repository.Repository;
import com.utils.date.TDate;
import com.utils.reflections.datatype.ArrayDataType;
import com.utils.reflections.datatype.DataType;
import com.utils.reflections.datatype.MapDataType;
import java.util.LinkedHashMap;
import java.util.UUID;
import java.util.regex.Pattern;

public class RAttributeElement extends Repository<Integer> {

    public final static Column<Integer> ID = new Column<>(c -> {
        c.repository = RAttributeElement.class;
        c.type = DataType.INT;
        c.required = true;
        c.autoGenerated = true;
        c.readOnly = true;
        c.unique = true;
        c.key = "id";
        c.name = "ID";

    });

    public final static Column<UUID> UID = new Column<>(c -> {
        c.repository = RAttributeElement.class;
        c.readOnly = true;
        c.type = DataType.UUID;
        c.key = "uid";
        c.name = "UIID";
        c.autoGenerated = true;
    });

    public final static Column<TDate> CREATED = new Column<>(c -> {
        c.repository = RAttributeElement.class;
        c.readOnly = true;
        c.autoGenerated = true;
        c.type = DataType.TIMESTAMP;
        c.name = "Utworzono";
        c.key = "created";
    });

    public final static Column<String> KEY = new Column<>(c -> {
        c.repository = RAttributeElement.class;
        c.type = DataType.KEY;
        c.key = "key";
        c.name = "Klucz";
    });

    public final static Column<String> TYPE = new Column<>(c -> {
        c.repository = RAttributeElement.class;
        c.type = DataType.STRING;
        c.key = "type";
        c.name = "Typ";
    });

    public final static Column<String> NAME = new Column<>(c -> {
        c.repository = RAttributeElement.class;
        c.type = DataType.STRING;
        c.required = true;
        c.key = "name";
        c.name = "Nazwa";
    });

    public final static Column<String> DESCRIPTION = new Column<>(c -> {
        c.repository = RAttributeElement.class;
        c.type = DataType.MEMO;
        c.daoName = "description";
        c.key = "desc";
        c.name = "Opis";
    });

    public final static Column<Boolean[]> REQUIRED = new Column<>(c -> {
        c.repository = RAttributeElement.class;
        c.type = DataType.BOOLEAN.asArray();
        c.key = "required";
        c.name = "Wymagany";
    });

    public final static Column<String[]> DEF_VAL = new Column<>(c -> {
        c.repository = RAttributeElement.class;
        c.type = new ArrayDataType<>(DataType.STRING);
        c.key = "defVal";
        c.daoName = "def_val";
        c.name = "Wartość domyślna";
    });

    public final static Column<Integer> MIN = new Column<>(c -> {
        c.repository = RAttributeElement.class;
        c.type = DataType.INT;
        c.key = "min";
        c.name = "Minimum";
    });

    public final static Column<Integer> MAX = new Column<>(c -> {
        c.repository = RAttributeElement.class;
        c.type = DataType.INT;
        c.key = "max";
        c.name = "Maksimum";
    });

    public final static Column<Pattern> REGEX = new Column<>(c -> {
        c.repository = RAttributeElement.class;
        c.type = DataType.REGEX;
        c.key = "regex";
        c.name = "Wyrażenie sprawdzające";
    });

    public final static Column<Integer> FOREIGN_ELM = new Column<>(c -> {
        c.repository = RAttributeElement.class;
        c.type = DataType.INT;
        c.daoName = "foreign_elm";
        c.key = "foreignElm";
        c.name = "Element zewnętrzny";
    });

    public final static Column<Boolean> ENCRYPTED = new Column<>(c -> {
        c.repository = RAttributeElement.class;
        c.type = DataType.BOOLEAN;
        c.key = "encrypted";
        c.name = "Zaszyfrowany";
    });

    public final static Column<LinkedHashMap<String, String>> ENUMERATE = new Column<>(c -> {
        c.repository = RAttributeElement.class;
        c.type = new MapDataType<>(DataType.STRING, DataType.STRING);
        c.name = "Enumerata";
        c.key = "enumerate";
    });

    public RAttributeElement() {
        super(c -> {
            c.key = "attrElm";
            c.tableName = "data.attribute_element";
            c.name = "Element atrybutu";
            c.primaryKey = ID;
        });
    }

}
