export const pythonScript = `import http.server
import socketserver

# Basic configuration
HOST = "0.0.0.0"  # Listen on all interfaces
PORT = 8080       # Server port

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler for the web server."""
    def do_GET(self):
        if self.path == "/":
            self.path = "index.html"  # Default page
        return super().do_GET()

# Create the server
with socketserver.TCPServer((HOST, PORT), CustomHTTPRequestHandler) as httpd:
    print(f"Server running at http://{HOST}:{PORT}")
    print("Press Ctrl+C to stop the server.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
`;

export const javaCodeSnippet = `import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.AbstractHandler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class WebServer {
    public static void main(String[] args) {
        // Set up the server on port 8080
        Server server = new Server(8080);

        // Set the handler for incoming requests
        server.setHandler(new HelloWorldHandler());

        try {
            // Start the server
            server.start();
            System.out.println("Server started on http://localhost:8080");
            server.join();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Custom handler to handle HTTP requests
    public static class HelloWorldHandler extends AbstractHandler {
        @Override
        public void handle(String target, 
                           HttpServletRequest request, 
                           HttpServletResponse response, 
                           int dispatch) throws IOException {
            // Set response type and status
            response.setContentType("text/html; charset=utf-8");
            response.setStatus(HttpServletResponse.SC_OK);

            // Write response content
            response.getWriter().println("<h1>Hello, World!</h1>");
        }
    }
}
`;

export const cSharpCodeSnippet = `using System;
using System.Net;
using System.Text;
using System.Threading;

class SimpleWebServer
{
    public static void Main()
    {
        // Create an HttpListener object to listen on a specific port
        HttpListener listener = new HttpListener();

        // Add the prefix to listen on port 8080
        listener.Prefixes.Add("http://localhost:8080/");

        // Start the server
        listener.Start();
        Console.WriteLine("Server started on http://localhost:8080/");

        // Continue listening for requests
        while (true)
        {
            // Wait for a request
            HttpListenerContext context = listener.GetContext();

            // Get the response
            HttpListenerResponse response = context.Response;

            // Set the response content type
            response.ContentType = "text/html";

            // The content to send as the response
            string responseString = "<html><body><h1>Hello from C# Web Server!</h1></body></html>";
            byte[] buffer = Encoding.UTF8.GetBytes(responseString);

            // Set the content length
            response.ContentLength64 = buffer.Length;

            // Write the response to the output stream
            response.OutputStream.Write(buffer, 0, buffer.Length);

            // Close the output stream
            response.OutputStream.Close();
        }
    }
}`;

export const typeScriptCodeSnippet = `import * as http from 'http';

const hostname = 'localhost';
const port = 8080;

// Create an HTTP server
const server = http.createServer((req, res) => {
    // Set the response headers
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');

    // Send a simple HTML response
    const responseString = '<html><body><h1>Hello from TypeScript Web Server!</h1></body></html>';
    res.end(responseString);
});

// Start the server
server.listen(port, hostname, () => {
    console.log(\`Server running at http://\${hostname}\:\${port}\/\`);
});
`;

export const cCodeSnippet = `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>

#define PORT 8080

// Function to handle incoming client connections
void handle_client(int client_socket) {
    char buffer[1024];
    const char *http_response = 
        "HTTP/1.1 200 OK\\r\\n"
        "Content-Type: text/html\\r\\n"
        "Connection: close\\r\\n\\r\\n"
        "<html><body><h1>Hello from C Web Server!</h1></body></html>";

    // Clear the buffer and read client data (optional for this example)
    memset(buffer, 0, sizeof(buffer));
    read(client_socket, buffer, sizeof(buffer));

    // Send the HTTP response to the client
    write(client_socket, http_response, strlen(http_response));

    // Close the client socket
    close(client_socket);
}

int main() {
    int server_socket, client_socket;
    struct sockaddr_in server_addr, client_addr;
    socklen_t client_len = sizeof(client_addr);

    // Create the socket
    server_socket = socket(AF_INET, SOCK_STREAM, 0);
    if (server_socket < 0) {
        perror("Error opening socket");
        exit(1);
    }

    // Set up the server address struct
    memset(&server_addr, 0, sizeof(server_addr));
    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = INADDR_ANY;
    server_addr.sin_port = htons(PORT);

    // Bind the socket to the address
    if (bind(server_socket, (struct sockaddr*)&server_addr, sizeof(server_addr)) < 0) {
        perror("Error binding socket");
        exit(1);
    }

    // Listen for incoming connections
    listen(server_socket, 5);
    printf("Server running at http://localhost:%d/\\n", PORT);

    // Accept client connections and handle them
    while (1) {
        client_socket = accept(server_socket, (struct sockaddr*)&client_addr, &client_len);
        if (client_socket < 0) {
            perror("Error accepting client connection");
            continue;
        }

        // Handle the client connection
        handle_client(client_socket);
    }

    // Close the server socket (though this won't be reached in this infinite loop)
    close(server_socket);
    return 0;
}
`;

export const cppCodeSnippet = `#include <iostream>
#include <cstring>
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>

#define PORT 8080

// Function to handle incoming client connections
void handle_client(int client_socket) {
    char buffer[1024];
    const char *http_response = 
        "HTTP/1.1 200 OK\\r\\n"
        "Content-Type: text/html\\r\\n"
        "Connection: close\\r\\n\\r\\n"
        "<html><body><h1>Hello from C++ Web Server!</h1></body></html>";

    // Clear the buffer and read client data (optional for this example)
    memset(buffer, 0, sizeof(buffer));
    read(client_socket, buffer, sizeof(buffer));

    // Send the HTTP response to the client
    write(client_socket, http_response, strlen(http_response));

    // Close the client socket
    close(client_socket);
}

int main() {
    int server_socket, client_socket;
    struct sockaddr_in server_addr, client_addr;
    socklen_t client_len = sizeof(client_addr);

    // Create the socket
    server_socket = socket(AF_INET, SOCK_STREAM, 0);
    if (server_socket < 0) {
        std::cerr << "Error opening socket" << std::endl;
        exit(1);
    }

    // Set up the server address struct
    memset(&server_addr, 0, sizeof(server_addr));
    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = INADDR_ANY;
    server_addr.sin_port = htons(PORT);

    // Bind the socket to the address
    if (bind(server_socket, (struct sockaddr*)&server_addr, sizeof(server_addr)) < 0) {
        std::cerr << "Error binding socket" << std::endl;
        exit(1);
    }

    // Listen for incoming connections
    listen(server_socket, 5);
    std::cout << "Server running at http://localhost:" << PORT << "/" << std::endl;

    // Accept client connections and handle them
    while (true) {
        client_socket = accept(server_socket, (struct sockaddr*)&client_addr, &client_len);
        if (client_socket < 0) {
            std::cerr << "Error accepting client connection" << std::endl;
            continue;
        }

        // Handle the client connection
        handle_client(client_socket);
    }

    // Close the server socket (though this won't be reached in this infinite loop)
    close(server_socket);
    return 0;
}
`