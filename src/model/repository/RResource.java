package model.repository;

import model.repository.catalog.RCatalog;
import com.model.repository.Column;
import com.model.repository.ForeignColumn;
import com.model.repository.Repository;
import com.utils.date.TDate;
import com.utils.reflections.datatype.ArrayDataType;
import com.utils.reflections.datatype.DataType;
import com.utils.reflections.datatype.EnumDataType;

import java.util.UUID;

public class RResource extends Repository<Integer> {

    public final static String[] FORMATS = {
        "Text",
        "Markdown",
        "DOC",
        "PDF",
        "HTML",
        "CSS",
        "JS",
        "XML",
        "JSON",
        "Java"};

    public static enum ResourceType {
        TEXT('D', "Tekst"),
        FILE('F', "Plik"),
        IMAGE('I', "Obraz");
        public final char key;
        public final CharSequence title;

        private ResourceType(char key, CharSequence name) {
            this.key = key;
            this.title = name;
        }

    }

    public final static Column<Integer> ID = new Column<>(c -> {
        c.repository = RResource.class;
        c.type = DataType.INT;
        c.unique = true;
        c.readOnly = true;
        c.autoGenerated = true;
        c.key = "id";
        c.name = "ID";
        c.hidden = true;
    });

    public final static Column<UUID> UID = new Column<>(c -> {
        c.repository = RResource.class;
        c.type = DataType.UUID;
        c.readOnly = true;
        c.autoGenerated = true;
        c.unique = true;
        c.key = "uid";
        c.name = "UID";
        c.hidden = true;
    });

    public final static Column<TDate> CREATED = new Column<>(c -> {
        c.repository = RResource.class;
        c.type = DataType.TIMESTAMP;
        c.readOnly = true;
        c.autoGenerated = true;
        c.key = "created";
        c.name = "Utworzono";
        c.hidden = true;
    });

    public final static Column<ResourceType> TYPE = new Column<>(c -> {
        c.repository = RResource.class;
        c.type = EnumDataType.ofEnum(ResourceType.class,
                e -> Character.toString(e.key),
                e -> e.title.toString());
        c.required = true;
        c.key = "type";
        c.name = "Typ";
    });

    public final static Column<String> NAME = new Column<>(c -> {
        c.repository = RResource.class;
        c.type = DataType.STRING;
        c.required = true;
        c.key = "name";
        c.name = "Nazwa";
    });

    public final static Column<String> DESC = new Column<>(c -> {
        c.repository = RResource.class;
        c.type = DataType.MEMO;
        c.key = "desc";
        c.daoName = "description";
        c.name = "Opis";
        c.hidden = true;
    });

    public final static Column<String> VALUE = new Column<>(c -> {
        c.repository = RResource.class;
        c.type = DataType.MEMO;
        c.key = "value";
        c.name = "Wartość";
        c.hidden = true;
    });

    public final static Column<String> FORMAT = new Column<>(c -> {
        c.repository = RResource.class;
        c.type = EnumDataType.ofArray(FORMATS);
        c.key = "format";
        c.name = "Format";
    });

    public final static ForeignColumn<Integer, RCatalog> CATALOG = new ForeignColumn<>(c -> {
        c.repository = RResource.class;
        c.type = DataType.INT;
        c.key = "cat";
        c.daoName = "catalog";
        c.name = "Katalog";
        c.required = true;
    }, RCatalog.ID);

    public final static Column<String> FILE = new Column<>(c -> {
        c.repository = RResource.class;
        c.type = DataType.FILE_NAME;
        c.key = "file";
        c.name = "Plik";
    });

    public final static Column<Long> SIZE = new Column<>(c -> {
        c.repository = RResource.class;
        c.type = DataType.SIZE;
        c.key = "size";
        c.name = "Rozmiar";
    });

    public final static Column<String> MD5 = new Column<>(c -> {
        c.repository = RResource.class;
        c.type = DataType.STRING;
        c.key = "md5";
        c.name = "MD5";
        c.readOnly = true;
        c.autoGenerated = true;
        c.hidden = true;
    });

    public final static ForeignColumn<Integer, RCryptKey> CRYPT_KEY = new ForeignColumn<>(c -> {
        c.repository = RResource.class;
        c.type = DataType.INT;
        c.daoName = "crypt_key";
        c.key = "cryptKey";
        c.name = "Klucz";
    }, RCryptKey.ID);

    public final static Column<String[]> TAGS = new Column<>(c -> {
        c.repository = RResource.class;
        c.type = new ArrayDataType<>(DataType.STRING);
        c.key = "tags";
        c.name = "Tagi";
        c.hidden = true;
    });

    public RResource() {
        super(c -> {
            c.key = "resource";
            c.daoName = "data.resource";
            c.name = "Zasób";
            c.primaryKey = ID;
            c.displayName = NAME;
        });

    }

}
