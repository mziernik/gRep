package model.data;

import com.database.model.DbCol;
import com.database.model.DsTable;
import com.utils.collections.Strings;
import java.util.UUID;

public class CategoryAttribute extends DsTable<CategoryAttribute, Integer> {

    @DbCol
    public final Col<Integer> id = column(Integer.class, "ID")
            .primaryKey();
    @DbCol
    public final Col<UUID> uid = column("UID");
    @DbCol
    public final ColF<Integer, Category> category = columnF("Kategoria");
    @DbCol
    public final ColF<Integer, Attribute> attribute = columnF("Atrybut");
    @DbCol()
    public final Col<Boolean> displayMask = column("Maska wyświetlania");
    @DbCol
    public final Col<Strings> defVal = column("Wartość domyślna");
    @DbCol
    public final Col<Boolean> required = column("Wymagane");
    @DbCol
    public final Col<Boolean> multiple = column("Wielokrotne");
    @DbCol(name = "\"unique\"")
    public final Col<Boolean> unique = column("Unikalny");
    @DbCol
    public final Col<Boolean> abstract_ = column("Abstrakcyjny");

    public CategoryAttribute(Integer id) {
        super("categoryAttr", "data.category_attribute", "Atrybut kategorii", id);
        init();
    }

}
