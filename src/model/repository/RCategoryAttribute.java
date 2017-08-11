package model.repository;

import com.model.repository.Column;
import com.model.repository.ForeignColumn;
import com.model.repository.Repository;
import com.utils.reflections.datatype.DataType;
import java.util.UUID;

public class RCategoryAttribute extends Repository<Integer> {

    public final static Column<Integer> ID = new Column<>(c -> {
        c.repository = RCatalogAttribute.class;
        c.type = DataType.INT;
        c.key = "id";
        c.name = "ID";
        c.hidden = true;
    });

    public final static Column<UUID> UID = new Column<>(c -> {
        c.repository = RCatalogAttribute.class;
        c.type = DataType.UUID;
        c.unique = true;
        c.readOnly = true;
        c.autoGenerated = true;
        c.required = true;
        c.key = "uid";
        c.name = "UID";
        c.hidden = true;
    });

    public final static ForeignColumn<Integer, RCategory> CATEGORY = new ForeignColumn<>(c -> {
        c.repository = RCatalogAttribute.class;
        c.type = DataType.INT;
        c.daoName = "category";
        c.key = "cat";
        c.name = "Kategoria";
    }, RCategory.ID);

    public final static ForeignColumn<Integer, RAttribute> ATTR = new ForeignColumn<>(c -> {
        c.repository = RCatalogAttribute.class;
        c.type = DataType.INT;
        c.daoName = "attribute";
        c.key = "attr";
        c.name = "Atrybut";
    }, RAttribute.ID);

    public final static Column<String> MASK = new Column<>(c -> {
        c.repository = RCatalogAttribute.class;
        c.type = DataType.STRING;
        c.daoName = "display_mask";
        c.key = "mask";
        c.name = "Maska wyświetlania";
        c.hidden = true;
    });

    public final static Column<Boolean> REQUIRED = new Column<>(c -> {
        c.repository = RCatalogAttribute.class;
        c.type = DataType.BOOLEAN;
        c.key = "required";
        c.name = "Wymagane";
    });

    public final static Column<Boolean> MULTIPLE = new Column<>(c -> {
        c.repository = RCatalogAttribute.class;
        c.type = DataType.BOOLEAN;
        c.key = "multiple";
        c.name = "Wielokrotne";
    });

    public final static Column<Boolean> UNIQUE = new Column<>(c -> {
        c.repository = RCatalogAttribute.class;
        c.type = DataType.BOOLEAN;
        c.key = "unique";
        c.daoName = "\"unique\"";
        c.name = "Unikalny";
    });

    public final static Column<Boolean> ABSTRACT = new Column<>(c -> {
        c.repository = RCatalogAttribute.class;
        c.type = DataType.BOOLEAN;
        c.key = "abstract";
        c.name = "Abstrakcyjny";
    });

    public RCategoryAttribute() {
        super(c -> {
            c.key = "categoryAttr";
            c.daoName = "data.category_attribute";
            c.name = "Atrybut kategorii";
            c.group = "Kategorie";
            c.primaryKey = ID;
        });

    }

}
