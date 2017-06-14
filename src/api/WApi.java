package api;

import com.cache.CachedData;
import com.database.model.Repository_old;
import com.model.repository.WRepository;
import com.json.JArray;
import com.json.JObject;
import com.servlet.interfaces.Arg;
import com.servlet.interfaces.Endpoint;
import com.servlet.websocket.WebSocketEndpoint;
import com.webapi.core.WebApiController;
import com.webapi.core.WebApiEndpoint;
import com.webapi.core.WebApiRequest;
import java.io.IOException;
import java.util.Map.Entry;

@Endpoint(url = {"api", "api/*"})
@WebSocketEndpoint(url = "api")
public class WApi extends WebApiController {

    @WebApiEndpoint
    public final WData data = new WData();

    @WebApiEndpoint
    public final WRepository repository = new WRepository();

    @WebApiEndpoint
    public JObject test1(WebApiRequest request,
            @Arg(name = "bool") Boolean bool,
            @Arg(name = "int") Integer i,
            @Arg(name = "str", required = false) String sss,
            @Arg(name = "object") JObject object,
            @Arg(name = "array") JArray array
    ) {

        JObject result = new JObject();

        result.put("OK", "sdfsdgsfdg");

        return result;

    }

    @WebApiEndpoint
    public CachedData export_() throws IOException {

        JObject json = new JObject();

        JObject jtables = json.objectC("tables");
        for (Entry<String, Repository_old<?, ?>> en : Repository_old.getTables().entrySet())
            jtables.put(en.getKey(), en.getValue().getJson().array("rows"));

        CachedData cd = new CachedData("aaa", "xxx", "plik.json");
        json.write(cd);
        cd.close();

        return cd;
    }

}
