package org.openas2.app;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicHeader;
import org.apache.http.util.EntityUtils;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;
import org.openas2.Component;
import org.openas2.TestResource;
import org.openas2.cmd.processor.RestCommandProcessor;
import org.openas2.lib.xml.PropertyReplacementFilter;
import org.openas2.util.XMLUtil;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

import net.bytebuddy.dynamic.scaffold.MethodGraph.NodeList;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Map;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.MatcherAssert.assertThat;


@RunWith(MockitoJUnitRunner.class)
/**
 *
 * @author javier
 */ public class RestApiTest {
    private static final TestResource RESOURCE = TestResource.forGroup("SingleServerTest");
    // private static File openAS2AHome;
    private static OpenAS2Server serverInstance;
    private static TemporaryFolder scratchpad = new TemporaryFolder();
    private static CloseableHttpClient httpclient;
    private static String baseUri;


    
    @Rule
    public TemporaryFolder tmp = new TemporaryFolder();

    @BeforeClass
    public static void startServer() throws Exception {
        // Set up some override properties so we can use the standard config in tests
        // to make sure the release package is fully tested
        scratchpad.create();
        File customPropsFile = scratchpad.newFile("openas2.properties");
        System.setProperty("openas2.properties.file", customPropsFile.getAbsolutePath());
        FileOutputStream fos = new FileOutputStream(customPropsFile);
        fos.write("restapi.command.processor.enabled=true\n".getBytes());
        fos.close();

        try {
            System.setProperty("org.apache.commons.logging.Log", "org.openas2.logging.Log");
            System.setProperty("org.openas2.logging.defaultlog", "TRACE");
            //	    executorService = Executors.newFixedThreadPool(20);
            String configPathname=RESOURCE.get("MyCompany", "config", "config.xml").getAbsolutePath();
            RestApiTest.serverInstance = new OpenAS2Server.Builder().run(configPathname);
            getBaseUrl(RestApiTest.serverInstance);
        } catch (Throwable e) {
            // aid for debugging JUnit tests
            System.err.println("ERROR occurred: " + ExceptionUtils.getStackTrace(e));
            throw new Exception(e);
        }

    }

    private static void getBaseUrl(OpenAS2Server server)  throws Exception {
        Component restCmp = server.getSession().getComponent("RestCommandProcessor");
        RestApiTest.baseUri = RestCommandProcessor.BASE_URI;
        restCmp.getParameters().forEach((t, u) -> {if(t.equals("baseuri")) RestApiTest.baseUri=u;});
        return;
    }
    @BeforeClass
    public static void startClient() throws Exception {
        RestApiTest.httpclient = HttpClients.createDefault();
    }

    @AfterClass
    public static void tearDown() throws Exception {
        serverInstance.shutdown();
        //	executorService.shutdown();
        System.clearProperty("openas2.properties.file");
        scratchpad.delete();
        httpclient.close();
    }

    protected String doRequest(HttpRequestBase request, boolean withAuth) throws IOException {
        String buffer = "";
        if (withAuth) {
            request.addHeader(new BasicHeader("Authorization", "Basic dXNlcklEOnBXZA=="));
        }
        CloseableHttpResponse response = RestApiTest.httpclient.execute(request);
        try {

            HttpEntity entity = response.getEntity();
            if (entity != null) {
                long len = entity.getContentLength();
                if (len != -1 && len < 2048) {
                    buffer = EntityUtils.toString(entity);
                } else {
                    throw new RuntimeException("Response too long");
                }
            }
        } finally {
            response.close();
        }
        return buffer;
    }

    @Test
    public void shouldRespondWithAccessDenied() throws Exception {
        
        String buffer;
        buffer = this.doRequest(new HttpGet(baseUri+"/api/"), false); // Kickstart Jersey
        buffer = this.doRequest(new HttpGet(baseUri+"/api/partnership/list"), false);
        assertThat("Getting partnership API without user/pass", buffer, containsString("You cannot access this resource"));

        buffer = this.doRequest(new HttpGet(baseUri+"/api/cert/list"), false);
        assertThat("Getting cert API without user/pass", buffer, containsString("You cannot access this resource"));
        
        buffer = this.doRequest(new HttpGet(baseUri+"/api/partner/list"), false);
        assertThat("Getting partner API without user/pass", buffer, containsString("You cannot access this resource"));

    }

    @Test
    public void shouldRespondWithPartners() throws Exception {
        String buffer = this.doRequest(new HttpGet(baseUri+"/api/partner/list"), true);
        assertThat("Getting Partners API ", buffer, containsString("type"));
        assertThat("Getting Partners API ", buffer, containsString("OK"));
    }

    @Test
    public void shouldRespondWithPartnerships() throws Exception {
        String buffer = this.doRequest(new HttpGet(baseUri+"/api/partnership/list"), true);
        assertThat("Getting Partnership API ", buffer, containsString("type"));
        assertThat("Getting Partnership API ", buffer, containsString("OK"));
    }

    @Test
    public void shouldRespondWithCerts() throws Exception {
        String buffer = this.doRequest(new HttpGet(baseUri+"/api/cert/list"), true);
        assertThat("Getting Certs API ", buffer, containsString("type"));
        assertThat("Getting Certs API ", buffer, containsString("OK"));
    }
    
}
