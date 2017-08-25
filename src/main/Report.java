package main;

import com.json.JElement;
import com.json.JObject;
import com.json.JSON;
import com.servlet.controller.Page;
import com.servlet.interfaces.Endpoint;
import com.servlet.requests.HttpRequest;

@Endpoint(url = "report")
public class Report extends Page {

    @Override
    public void onRequest(HttpRequest http) throws Exception {
        http.addCorsHeaders();
        
        JElement json = JSON.parse(http.getInputStream());

        returnJson(new JObject().put("status", "OKi"));
    }

}
