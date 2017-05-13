package api;

import com.cache.CachedData;
import com.database.model.DsTable;
import com.database.model.WDbModel;
import com.json.JObject;
import com.servlet.interfaces.Endpoint;
import com.servlet.websocket.WebSocketEndpoint;
import com.webapi.core.WebApiController;
import com.webapi.core.WebApiEndpoint;
import java.io.IOException;
import java.util.Map.Entry;

@Endpoint(url = {"api", "api/*"})
@WebSocketEndpoint(url = "api")
public class WApi extends WebApiController {

    @WebApiEndpoint
    public final WData data = new WData();

    @WebApiEndpoint
    public final WDbModel model = new WDbModel();

    @WebApiEndpoint
    public CachedData export() throws IOException {

        JObject json = new JObject();

        JObject jtables = json.objectC("tables");
        for (Entry<String, DsTable<?, ?>> en : DsTable.getTables().entrySet())
            jtables.put(en.getKey(), en.getValue().getJson().array("rows"));

        CachedData cd = new CachedData("aaa", "xxx", "plik.json");
        json.write(cd);
        cd.close();

        return cd;
    }

}
