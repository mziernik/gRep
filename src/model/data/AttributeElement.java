package model.data;

import com.database.QueryRow;
import com.database.model.DbCol;
import com.database.model.DsTable;
import com.database.queries.MultipleQuery;
import com.exceptions.SQLError;
import com.model.dataset.DsColumn;
import com.utils.collections.Strings;
import com.utils.date.TDate;
import java.util.Map;
import java.util.UUID;

public class AttributeElement extends DsTable<AttributeElement, Integer> {

    @DbCol
    public final Col<Integer> id = column(Integer.class, "ID").primaryKey();
    @DbCol
    public final Col<UUID> uid = column(UUID.class, "UID").readOnly(true);
    @DbCol
    public final Col<TDate> created = column(TDate.class, "Utworzono").readOnly(true);
    @DbCol
    public final Col<String> key = column("Klucz");
    @DbCol
    public final Col<String> type = column("Typ");
    @DbCol
    public final Col<String> name = column("Nazwa");
    @DbCol
    public final Col<String> description = column("Opis");
    @DbCol
    public final Col<Boolean> required = column("Wymagany");
    @DbCol
    public final Col<Strings> defVal = column("Wartość domyślna");
    @DbCol
    public final Col<Integer> min = column("Minimum");
    @DbCol
    public final Col<Integer> max = column("Maksimum");
    @DbCol
    public final Col<String> regex = column("Wyrażenie sprawdzające");
    @DbCol
    public final Col<Integer> foreignElm = column("Element zewnętrzny");
    @DbCol
    public final Col<Boolean> encrypted = column("Zaszyfrowany");
    
    public final Col<Map<String, String>> enumerate = column("Enumerata");

    public AttributeElement(Integer id) {
        super("attrElm", "data.attribute_element", "Element atrybutu", id);
        init();
    }

    @Override
    protected void getUpdateQuery(MultipleQuery mqry, Map<DsColumn<?, AttributeElement, QueryRow, ?>, Object> cells) throws SQLError {
        super.getUpdateQuery(mqry, cells); 
    }

}
