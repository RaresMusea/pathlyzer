import { ICodeBlock } from "@/components/learning/courses/course-preview/code-section-preview/CodeBlock";
import { ICodeGroup } from "@/components/learning/courses/course-preview/code-section-preview/CodeGroup";

export const demoGroup: ICodeBlock[] = [
    {
        code: `#include <iostream>
#include <string>
#include <thread>
#include <sstream>
#include <vector>
#include <cstring>
#include <netinet/in.h>
#include <unistd.h>

const int PORT = 8080;

std::string build_response() {
    std::string body = "<html><body><h1>Hello from C++ HTTP Server</h1></body></html>";
    std::ostringstream response;
    response << "HTTP/1.1 200 OK\\r\\n"
             << "Content-Type: text/html\\r\\n"
             << "Content-Length: " << body.size() << "\\r\\n"
             << "Connection: close\\r\\n\\r\\n"
             << body;
    return response.str();
}

void handle_client(int client_socket) {
    char buffer[4096];
    recv(client_socket, buffer, sizeof(buffer), 0);
    std::string response = build_response();
    send(client_socket, response.c_str(), response.size(), 0);
    close(client_socket);
}

int main() {
    int server_fd = socket(AF_INET, SOCK_STREAM, 0);
    sockaddr_in address;
    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons(PORT);
    bind(server_fd, (struct sockaddr*)&address, sizeof(address));
    listen(server_fd, 10);

    while (true) {
        socklen_t addrlen = sizeof(address);
        int client_socket = accept(server_fd, (struct sockaddr*)&address, &addrlen);
        std::thread(handle_client, client_socket).detach();
    }

    close(server_fd);
    return 0;
}`,
        language: `cpp`,
        html: `<pre class="shiki catppuccin-mocha" style="background-color:#1e1e2e;color:#cdd6f4" tabindex="0"><code><span class="line"><span style="color:#F9E2AF">#include</span><span style="color:#A6E3A1"> &#x3C;iostream></span></span>
<span class="line"><span style="color:#F9E2AF">#include</span><span style="color:#A6E3A1"> &#x3C;string></span></span>
<span class="line"><span style="color:#F9E2AF">#include</span><span style="color:#A6E3A1"> &#x3C;thread></span></span>
<span class="line"><span style="color:#F9E2AF">#include</span><span style="color:#A6E3A1"> &#x3C;sstream></span></span>
<span class="line"><span style="color:#F9E2AF">#include</span><span style="color:#A6E3A1"> &#x3C;vector></span></span>
<span class="line"><span style="color:#F9E2AF">#include</span><span style="color:#A6E3A1"> &#x3C;cstring></span></span>
<span class="line"><span style="color:#F9E2AF">#include</span><span style="color:#A6E3A1"> &#x3C;netinet/in.h></span></span>
<span class="line"><span style="color:#F9E2AF">#include</span><span style="color:#A6E3A1"> &#x3C;unistd.h></span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">const</span><span style="color:#CBA6F7"> int</span><span style="color:#CDD6F4"> PORT </span><span style="color:#94E2D5">=</span><span style="color:#FAB387"> 8080</span><span style="color:#9399B2">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F9E2AF">std</span><span style="color:#9399B2">::</span><span style="color:#F9E2AF;font-style:italic">string</span><span style="color:#89B4FA;font-style:italic"> build_response</span><span style="color:#9399B2">()</span><span style="color:#9399B2"> {</span></span>
<span class="line"><span style="color:#F9E2AF">    std</span><span style="color:#9399B2">::</span><span style="color:#CDD6F4">string body </span><span style="color:#94E2D5">=</span><span style="color:#A6E3A1"> "&#x3C;html>&#x3C;body>&#x3C;h1>Hello from C++ HTTP Server&#x3C;/h1>&#x3C;/body>&#x3C;/html>"</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#F9E2AF">    std</span><span style="color:#9399B2">::</span><span style="color:#CDD6F4">ostringstream response</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#CDD6F4">    response </span><span style="color:#94E2D5">&#x3C;&#x3C;</span><span style="color:#A6E3A1"> "HTTP/1.1 200 OK</span><span style="color:#F5C2E7">\r\n</span><span style="color:#A6E3A1">"</span></span>
<span class="line"><span style="color:#94E2D5">             &#x3C;&#x3C;</span><span style="color:#A6E3A1"> "Content-Type: text/html</span><span style="color:#F5C2E7">\r\n</span><span style="color:#A6E3A1">"</span></span>
<span class="line"><span style="color:#94E2D5">             &#x3C;&#x3C;</span><span style="color:#A6E3A1"> "Content-Length: "</span><span style="color:#94E2D5"> &#x3C;&#x3C;</span><span style="color:#CDD6F4"> body</span><span style="color:#9399B2">.</span><span style="color:#89B4FA;font-style:italic">size</span><span style="color:#9399B2">()</span><span style="color:#94E2D5"> &#x3C;&#x3C;</span><span style="color:#A6E3A1"> "</span><span style="color:#F5C2E7">\r\n</span><span style="color:#A6E3A1">"</span></span>
<span class="line"><span style="color:#94E2D5">             &#x3C;&#x3C;</span><span style="color:#A6E3A1"> "Connection: close</span><span style="color:#F5C2E7">\r\n\r\n</span><span style="color:#A6E3A1">"</span></span>
<span class="line"><span style="color:#94E2D5">             &#x3C;&#x3C;</span><span style="color:#CDD6F4"> body</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#CBA6F7">    return</span><span style="color:#CDD6F4"> response</span><span style="color:#9399B2">.</span><span style="color:#89B4FA;font-style:italic">str</span><span style="color:#9399B2">();</span></span>
<span class="line"><span style="color:#9399B2">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">void</span><span style="color:#89B4FA;font-style:italic"> handle_client</span><span style="color:#9399B2">(</span><span style="color:#CBA6F7">int</span><span style="color:#EBA0AC;font-style:italic"> client_socket</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> {</span></span>
<span class="line"><span style="color:#CBA6F7">    char</span><span style="color:#CDD6F4"> buffer</span><span style="color:#9399B2">[</span><span style="color:#FAB387">4096</span><span style="color:#9399B2">];</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">    recv</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">client_socket</span><span style="color:#9399B2">,</span><span style="color:#CDD6F4"> buffer</span><span style="color:#9399B2">,</span><span style="color:#94E2D5"> sizeof</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">buffer</span><span style="color:#9399B2">),</span><span style="color:#FAB387"> 0</span><span style="color:#9399B2">);</span></span>
<span class="line"><span style="color:#F9E2AF">    std</span><span style="color:#9399B2">::</span><span style="color:#CDD6F4">string response </span><span style="color:#94E2D5">=</span><span style="color:#89B4FA;font-style:italic"> build_response</span><span style="color:#9399B2">();</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">    send</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">client_socket</span><span style="color:#9399B2">,</span><span style="color:#CDD6F4"> response</span><span style="color:#9399B2">.</span><span style="color:#89B4FA;font-style:italic">c_str</span><span style="color:#9399B2">(),</span><span style="color:#CDD6F4"> response</span><span style="color:#9399B2">.</span><span style="color:#89B4FA;font-style:italic">size</span><span style="color:#9399B2">(),</span><span style="color:#FAB387"> 0</span><span style="color:#9399B2">);</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">    close</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">client_socket</span><span style="color:#9399B2">);</span></span>
<span class="line"><span style="color:#9399B2">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">int</span><span style="color:#89B4FA;font-style:italic"> main</span><span style="color:#9399B2">()</span><span style="color:#9399B2"> {</span></span>
<span class="line"><span style="color:#CBA6F7">    int</span><span style="color:#CDD6F4"> server_fd </span><span style="color:#94E2D5">=</span><span style="color:#89B4FA;font-style:italic"> socket</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">AF_INET</span><span style="color:#9399B2">,</span><span style="color:#CDD6F4"> SOCK_STREAM</span><span style="color:#9399B2">,</span><span style="color:#FAB387"> 0</span><span style="color:#9399B2">);</span></span>
<span class="line"><span style="color:#CDD6F4">    sockaddr_in address</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#CDD6F4">    address</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">sin_family </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> AF_INET</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#CDD6F4">    address</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">sin_addr</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">s_addr </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> INADDR_ANY</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#CDD6F4">    address</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">sin_port </span><span style="color:#94E2D5">=</span><span style="color:#89B4FA;font-style:italic"> htons</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">PORT</span><span style="color:#9399B2">);</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">    bind</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">server_fd</span><span style="color:#9399B2">,</span><span style="color:#9399B2"> (</span><span style="color:#CBA6F7">struct</span><span style="color:#F9E2AF;font-style:italic"> sockaddr</span><span style="color:#CBA6F7">*</span><span style="color:#9399B2">)</span><span style="color:#94E2D5">&#x26;</span><span style="color:#CDD6F4">address</span><span style="color:#9399B2">,</span><span style="color:#94E2D5"> sizeof</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">address</span><span style="color:#9399B2">));</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">    listen</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">server_fd</span><span style="color:#9399B2">,</span><span style="color:#FAB387"> 10</span><span style="color:#9399B2">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">    while</span><span style="color:#9399B2"> (</span><span style="color:#FAB387">true</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> {</span></span>
<span class="line"><span style="color:#F9E2AF;font-style:italic">        socklen_t</span><span style="color:#CDD6F4"> addrlen </span><span style="color:#94E2D5">=</span><span style="color:#94E2D5"> sizeof</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">address</span><span style="color:#9399B2">);</span></span>
<span class="line"><span style="color:#CBA6F7">        int</span><span style="color:#CDD6F4"> client_socket </span><span style="color:#94E2D5">=</span><span style="color:#89B4FA;font-style:italic"> accept</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">server_fd</span><span style="color:#9399B2">,</span><span style="color:#9399B2"> (</span><span style="color:#CBA6F7">struct</span><span style="color:#F9E2AF;font-style:italic"> sockaddr</span><span style="color:#CBA6F7">*</span><span style="color:#9399B2">)</span><span style="color:#94E2D5">&#x26;</span><span style="color:#CDD6F4">address</span><span style="color:#9399B2">,</span><span style="color:#94E2D5"> &#x26;</span><span style="color:#CDD6F4">addrlen</span><span style="color:#9399B2">);</span></span>
<span class="line"><span style="color:#F9E2AF">        std</span><span style="color:#9399B2">::</span><span style="color:#89B4FA;font-style:italic">thread</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">handle_client</span><span style="color:#9399B2">,</span><span style="color:#CDD6F4"> client_socket</span><span style="color:#9399B2">).</span><span style="color:#89B4FA;font-style:italic">detach</span><span style="color:#9399B2">();</span></span>
<span class="line"><span style="color:#9399B2">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">    close</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">server_fd</span><span style="color:#9399B2">);</span></span>
<span class="line"><span style="color:#CBA6F7">    return</span><span style="color:#FAB387"> 0</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#9399B2">}</span></span>
<span class="line"></span></code></pre>`
    },
    {
        code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <netinet/in.h>
#include <pthread.h>

#define PORT 8080

void* handle_client(void* arg) {
    int client_socket = *(int*)arg;
    free(arg);

    char buffer[4096];
    recv(client_socket, buffer, sizeof(buffer), 0);

    const char* body = "<html><body><h1>Hello from C HTTP Server</h1></body></html>";
    char response[8192];
    snprintf(response, sizeof(response),
        "HTTP/1.1 200 OK\\r\\n"
        "Content-Type: text/html\\r\\n"
        "Content-Length: %ld\\r\\n"
        "Connection: close\\r\\n\\r\\n"
        "%s",
        strlen(body), body);

    send(client_socket, response, strlen(response), 0);
    close(client_socket);
    return NULL;
}

int main() {
    int server_fd = socket(AF_INET, SOCK_STREAM, 0);

    struct sockaddr_in address;
    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons(PORT);

    bind(server_fd, (struct sockaddr*)&address, sizeof(address));
    listen(server_fd, 10);

    while (1) {
        socklen_t addrlen = sizeof(address);
        int* client_socket = malloc(sizeof(int));
        *client_socket = accept(server_fd, (struct sockaddr*)&address, &addrlen);
        pthread_t thread_id;
        pthread_create(&thread_id, NULL, handle_client, client_socket);
        pthread_detach(thread_id);
    }

    close(server_fd);
    return 0;
}`,
        language: `c`,
        html: `<pre class="shiki catppuccin-mocha" style="background-color:#1e1e2e;color:#cdd6f4" tabindex="0"><code><span class="line"><span style="color:#F9E2AF">#include</span><span style="color:#A6E3A1"> &#x3C;stdio.h></span></span>
<span class="line"><span style="color:#F9E2AF">#include</span><span style="color:#A6E3A1"> &#x3C;stdlib.h></span></span>
<span class="line"><span style="color:#F9E2AF">#include</span><span style="color:#A6E3A1"> &#x3C;string.h></span></span>
<span class="line"><span style="color:#F9E2AF">#include</span><span style="color:#A6E3A1"> &#x3C;unistd.h></span></span>
<span class="line"><span style="color:#F9E2AF">#include</span><span style="color:#A6E3A1"> &#x3C;netinet/in.h></span></span>
<span class="line"><span style="color:#F9E2AF">#include</span><span style="color:#A6E3A1"> &#x3C;pthread.h></span></span>
<span class="line"></span>
<span class="line"><span style="color:#F9E2AF">#define</span><span style="color:#89B4FA;font-style:italic"> PORT</span><span style="color:#FAB387"> 8080</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">void</span><span style="color:#94E2D5">*</span><span style="color:#89B4FA;font-style:italic"> handle_client</span><span style="color:#9399B2">(</span><span style="color:#CBA6F7">void</span><span style="color:#94E2D5">*</span><span style="color:#EBA0AC;font-style:italic"> arg</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> {</span></span>
<span class="line"><span style="color:#CBA6F7">    int</span><span style="color:#CDD6F4"> client_socket </span><span style="color:#94E2D5">=</span><span style="color:#94E2D5"> *</span><span style="color:#9399B2">(</span><span style="color:#CBA6F7">int</span><span style="color:#94E2D5">*</span><span style="color:#9399B2">)</span><span style="color:#CDD6F4">arg</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">    free</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">arg</span><span style="color:#9399B2">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">    char</span><span style="color:#CDD6F4"> buffer</span><span style="color:#9399B2">[</span><span style="color:#FAB387">4096</span><span style="color:#9399B2">];</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">    recv</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">client_socket</span><span style="color:#9399B2">,</span><span style="color:#CDD6F4"> buffer</span><span style="color:#9399B2">,</span><span style="color:#94E2D5"> sizeof</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">buffer</span><span style="color:#9399B2">),</span><span style="color:#FAB387"> 0</span><span style="color:#9399B2">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">    const</span><span style="color:#CBA6F7"> char</span><span style="color:#94E2D5">*</span><span style="color:#CDD6F4"> body </span><span style="color:#94E2D5">=</span><span style="color:#A6E3A1"> "&#x3C;html>&#x3C;body>&#x3C;h1>Hello from C HTTP Server&#x3C;/h1>&#x3C;/body>&#x3C;/html>"</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#CBA6F7">    char</span><span style="color:#CDD6F4"> response</span><span style="color:#9399B2">[</span><span style="color:#FAB387">8192</span><span style="color:#9399B2">];</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">    snprintf</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">response</span><span style="color:#9399B2">,</span><span style="color:#94E2D5"> sizeof</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">response</span><span style="color:#9399B2">),</span></span>
<span class="line"><span style="color:#A6E3A1">        "HTTP/1.1 200 OK</span><span style="color:#F5C2E7">\r\n</span><span style="color:#A6E3A1">"</span></span>
<span class="line"><span style="color:#A6E3A1">        "Content-Type: text/html</span><span style="color:#F5C2E7">\r\n</span><span style="color:#A6E3A1">"</span></span>
<span class="line"><span style="color:#A6E3A1">        "Content-Length: %ld</span><span style="color:#F5C2E7">\r\n</span><span style="color:#A6E3A1">"</span></span>
<span class="line"><span style="color:#A6E3A1">        "Connection: close</span><span style="color:#F5C2E7">\r\n\r\n</span><span style="color:#A6E3A1">"</span></span>
<span class="line"><span style="color:#A6E3A1">        "%s"</span><span style="color:#9399B2">,</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">        strlen</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">body</span><span style="color:#9399B2">),</span><span style="color:#CDD6F4"> body</span><span style="color:#9399B2">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">    send</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">client_socket</span><span style="color:#9399B2">,</span><span style="color:#CDD6F4"> response</span><span style="color:#9399B2">,</span><span style="color:#89B4FA;font-style:italic"> strlen</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">response</span><span style="color:#9399B2">),</span><span style="color:#FAB387"> 0</span><span style="color:#9399B2">);</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">    close</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">client_socket</span><span style="color:#9399B2">);</span></span>
<span class="line"><span style="color:#CBA6F7">    return</span><span style="color:#F38BA8"> NULL</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#9399B2">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">int</span><span style="color:#89B4FA;font-style:italic"> main</span><span style="color:#9399B2">()</span><span style="color:#9399B2"> {</span></span>
<span class="line"><span style="color:#CBA6F7">    int</span><span style="color:#CDD6F4"> server_fd </span><span style="color:#94E2D5">=</span><span style="color:#89B4FA;font-style:italic"> socket</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">AF_INET</span><span style="color:#9399B2">,</span><span style="color:#CDD6F4"> SOCK_STREAM</span><span style="color:#9399B2">,</span><span style="color:#FAB387"> 0</span><span style="color:#9399B2">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">    struct</span><span style="color:#CDD6F4"> sockaddr_in address</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#CDD6F4">    address</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">sin_family </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> AF_INET</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#CDD6F4">    address</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">sin_addr</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">s_addr </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> INADDR_ANY</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#CDD6F4">    address</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">sin_port </span><span style="color:#94E2D5">=</span><span style="color:#89B4FA;font-style:italic"> htons</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">PORT</span><span style="color:#9399B2">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">    bind</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">server_fd</span><span style="color:#9399B2">,</span><span style="color:#9399B2"> (</span><span style="color:#CBA6F7">struct</span><span style="color:#CDD6F4"> sockaddr</span><span style="color:#94E2D5">*</span><span style="color:#9399B2">)</span><span style="color:#94E2D5">&#x26;</span><span style="color:#CDD6F4">address</span><span style="color:#9399B2">,</span><span style="color:#94E2D5"> sizeof</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">address</span><span style="color:#9399B2">));</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">    listen</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">server_fd</span><span style="color:#9399B2">,</span><span style="color:#FAB387"> 10</span><span style="color:#9399B2">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">    while</span><span style="color:#9399B2"> (</span><span style="color:#FAB387">1</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> {</span></span>
<span class="line"><span style="color:#F9E2AF;font-style:italic">        socklen_t</span><span style="color:#CDD6F4"> addrlen </span><span style="color:#94E2D5">=</span><span style="color:#94E2D5"> sizeof</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">address</span><span style="color:#9399B2">);</span></span>
<span class="line"><span style="color:#CBA6F7">        int</span><span style="color:#94E2D5">*</span><span style="color:#CDD6F4"> client_socket </span><span style="color:#94E2D5">=</span><span style="color:#89B4FA;font-style:italic"> malloc</span><span style="color:#9399B2">(</span><span style="color:#94E2D5">sizeof</span><span style="color:#9399B2">(</span><span style="color:#CBA6F7">int</span><span style="color:#9399B2">));</span></span>
<span class="line"><span style="color:#94E2D5">        *</span><span style="color:#CDD6F4">client_socket </span><span style="color:#94E2D5">=</span><span style="color:#89B4FA;font-style:italic"> accept</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">server_fd</span><span style="color:#9399B2">,</span><span style="color:#9399B2"> (</span><span style="color:#CBA6F7">struct</span><span style="color:#CDD6F4"> sockaddr</span><span style="color:#94E2D5">*</span><span style="color:#9399B2">)</span><span style="color:#94E2D5">&#x26;</span><span style="color:#CDD6F4">address</span><span style="color:#9399B2">,</span><span style="color:#94E2D5"> &#x26;</span><span style="color:#CDD6F4">addrlen</span><span style="color:#9399B2">);</span></span>
<span class="line"><span style="color:#CBA6F7">        pthread_t</span><span style="color:#CDD6F4"> thread_id</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">        pthread_create</span><span style="color:#9399B2">(</span><span style="color:#94E2D5">&#x26;</span><span style="color:#CDD6F4">thread_id</span><span style="color:#9399B2">,</span><span style="color:#F38BA8"> NULL</span><span style="color:#9399B2">,</span><span style="color:#CDD6F4"> handle_client</span><span style="color:#9399B2">,</span><span style="color:#CDD6F4"> client_socket</span><span style="color:#9399B2">);</span></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">        pthread_detach</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">thread_id</span><span style="color:#9399B2">);</span></span>
<span class="line"><span style="color:#9399B2">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89B4FA;font-style:italic">    close</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">server_fd</span><span style="color:#9399B2">);</span></span>
<span class="line"><span style="color:#CBA6F7">    return</span><span style="color:#FAB387"> 0</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#9399B2">}</span></span>
<span class="line"></span></code></pre>`
    },
    {
        code: `import java.io.*;
import java.net.*;

public class SimpleHttpServer {
    public static void main(String[] args) throws IOException {
        ServerSocket serverSocket = new ServerSocket(8080);
        while (true) {
            Socket clientSocket = serverSocket.accept();
            new Thread(() -> handleClient(clientSocket)).start();
        }
    }

    private static void handleClient(Socket clientSocket) {
        try (
            BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
            OutputStream out = clientSocket.getOutputStream()
        ) {
            String line;
            while (!(line = in.readLine()).isEmpty()) {}

            String body = "<html><body><h1>Hello from Java HTTP Server</h1></body></html>";
            String response = "HTTP/1.1 200 OK\\r\\n" +
                              "Content-Type: text/html\\r\\n" +
                              "Content-Length: " + body.length() + "\\r\\n" +
                              "Connection: close\\r\\n\\r\\n" +
                              body;

            out.write(response.getBytes());
            out.flush();
            clientSocket.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}`,
        language: "java",
        html: `<pre class="shiki catppuccin-mocha" style="background-color:#1e1e2e;color:#cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CBA6F7">import</span><span style="color:#CDD6F4"> java</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">io</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">*</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#CBA6F7">import</span><span style="color:#CDD6F4"> java</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">net</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">*</span><span style="color:#9399B2">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">public</span><span style="color:#CBA6F7"> class</span><span style="color:#F9E2AF;font-style:italic"> SimpleHttpServer</span><span style="color:#9399B2"> {</span></span>
<span class="line"><span style="color:#CBA6F7">    public</span><span style="color:#CBA6F7"> static</span><span style="color:#CBA6F7"> void</span><span style="color:#89B4FA;font-style:italic"> main</span><span style="color:#9399B2">(</span><span style="color:#CBA6F7">String</span><span style="color:#9399B2">[]</span><span style="color:#EBA0AC;font-style:italic"> args</span><span style="color:#9399B2">)</span><span style="color:#CBA6F7"> throws</span><span style="color:#CBA6F7"> IOException</span><span style="color:#9399B2"> {</span></span>
<span class="line"><span style="color:#CBA6F7">        ServerSocket</span><span style="color:#CDD6F4"> serverSocket </span><span style="color:#94E2D5">=</span><span style="color:#CBA6F7"> new</span><span style="color:#89B4FA;font-style:italic"> ServerSocket</span><span style="color:#9399B2">(</span><span style="color:#FAB387">8080</span><span style="color:#9399B2">);</span></span>
<span class="line"><span style="color:#CBA6F7">        while</span><span style="color:#9399B2"> (</span><span style="color:#F38BA8">true</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> {</span></span>
<span class="line"><span style="color:#CBA6F7">            Socket</span><span style="color:#CDD6F4"> clientSocket </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> serverSocket</span><span style="color:#9399B2">.</span><span style="color:#89B4FA;font-style:italic">accept</span><span style="color:#9399B2">();</span></span>
<span class="line"><span style="color:#CBA6F7">            new</span><span style="color:#89B4FA;font-style:italic"> Thread</span><span style="color:#9399B2">(()</span><span style="color:#CBA6F7"> -></span><span style="color:#89B4FA;font-style:italic"> handleClient</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">clientSocket</span><span style="color:#9399B2">)).</span><span style="color:#89B4FA;font-style:italic">start</span><span style="color:#9399B2">();</span></span>
<span class="line"><span style="color:#9399B2">        }</span></span>
<span class="line"><span style="color:#9399B2">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">    private</span><span style="color:#CBA6F7"> static</span><span style="color:#CBA6F7"> void</span><span style="color:#89B4FA;font-style:italic"> handleClient</span><span style="color:#9399B2">(</span><span style="color:#CBA6F7">Socket</span><span style="color:#EBA0AC;font-style:italic"> clientSocket</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> {</span></span>
<span class="line"><span style="color:#CBA6F7">        try</span><span style="color:#9399B2"> (</span></span>
<span class="line"><span style="color:#CBA6F7">            BufferedReader</span><span style="color:#CDD6F4"> in </span><span style="color:#94E2D5">=</span><span style="color:#CBA6F7"> new</span><span style="color:#89B4FA;font-style:italic"> BufferedReader</span><span style="color:#9399B2">(</span><span style="color:#CBA6F7">new</span><span style="color:#89B4FA;font-style:italic"> InputStreamReader</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">clientSocket</span><span style="color:#9399B2">.</span><span style="color:#89B4FA;font-style:italic">getInputStream</span><span style="color:#9399B2">()));</span></span>
<span class="line"><span style="color:#CBA6F7">            OutputStream</span><span style="color:#CDD6F4"> out </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> clientSocket</span><span style="color:#9399B2">.</span><span style="color:#89B4FA;font-style:italic">getOutputStream</span><span style="color:#9399B2">()</span></span>
<span class="line"><span style="color:#9399B2">        )</span><span style="color:#9399B2"> {</span></span>
<span class="line"><span style="color:#CBA6F7">            String</span><span style="color:#CDD6F4"> line</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#CBA6F7">            while</span><span style="color:#9399B2"> (</span><span style="color:#94E2D5">!</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">line </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> in</span><span style="color:#9399B2">.</span><span style="color:#89B4FA;font-style:italic">readLine</span><span style="color:#9399B2">()).</span><span style="color:#89B4FA;font-style:italic">isEmpty</span><span style="color:#9399B2">())</span><span style="color:#9399B2"> {}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">            String</span><span style="color:#CDD6F4"> body </span><span style="color:#94E2D5">=</span><span style="color:#A6E3A1"> "&#x3C;html>&#x3C;body>&#x3C;h1>Hello from Java HTTP Server&#x3C;/h1>&#x3C;/body>&#x3C;/html>"</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#CBA6F7">            String</span><span style="color:#CDD6F4"> response </span><span style="color:#94E2D5">=</span><span style="color:#A6E3A1"> "HTTP/1.1 200 OK</span><span style="color:#F5C2E7">\r\n</span><span style="color:#A6E3A1">"</span><span style="color:#94E2D5"> +</span></span>
<span class="line"><span style="color:#A6E3A1">                              "Content-Type: text/html</span><span style="color:#F5C2E7">\r\n</span><span style="color:#A6E3A1">"</span><span style="color:#94E2D5"> +</span></span>
<span class="line"><span style="color:#A6E3A1">                              "Content-Length: "</span><span style="color:#94E2D5"> +</span><span style="color:#CDD6F4"> body</span><span style="color:#9399B2">.</span><span style="color:#89B4FA;font-style:italic">length</span><span style="color:#9399B2">()</span><span style="color:#94E2D5"> +</span><span style="color:#A6E3A1"> "</span><span style="color:#F5C2E7">\r\n</span><span style="color:#A6E3A1">"</span><span style="color:#94E2D5"> +</span></span>
<span class="line"><span style="color:#A6E3A1">                              "Connection: close</span><span style="color:#F5C2E7">\r\n\r\n</span><span style="color:#A6E3A1">"</span><span style="color:#94E2D5"> +</span></span>
<span class="line"><span style="color:#CDD6F4">                              body</span><span style="color:#9399B2">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CDD6F4">            out</span><span style="color:#9399B2">.</span><span style="color:#89B4FA;font-style:italic">write</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">response</span><span style="color:#9399B2">.</span><span style="color:#89B4FA;font-style:italic">getBytes</span><span style="color:#9399B2">());</span></span>
<span class="line"><span style="color:#CDD6F4">            out</span><span style="color:#9399B2">.</span><span style="color:#89B4FA;font-style:italic">flush</span><span style="color:#9399B2">();</span></span>
<span class="line"><span style="color:#CDD6F4">            clientSocket</span><span style="color:#9399B2">.</span><span style="color:#89B4FA;font-style:italic">close</span><span style="color:#9399B2">();</span></span>
<span class="line"><span style="color:#9399B2">        }</span><span style="color:#CBA6F7"> catch</span><span style="color:#9399B2"> (</span><span style="color:#CBA6F7">IOException</span><span style="color:#EBA0AC;font-style:italic"> e</span><span style="color:#9399B2">)</span><span style="color:#9399B2"> {</span></span>
<span class="line"><span style="color:#CDD6F4">            e</span><span style="color:#9399B2">.</span><span style="color:#89B4FA;font-style:italic">printStackTrace</span><span style="color:#9399B2">();</span></span>
<span class="line"><span style="color:#9399B2">        }</span></span>
<span class="line"><span style="color:#9399B2">    }</span></span>
<span class="line"><span style="color:#9399B2">}</span></span></code></pre>`
    },
    {
        code: `using System;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;

class SimpleHttpServer
{
    static void Main()
    {
        TcpListener listener = new TcpListener(IPAddress.Any, 8080);
        listener.Start();
        while (true)
        {
            TcpClient client = listener.AcceptTcpClient();
            new Thread(() => HandleClient(client)).Start();
        }
    }

    static void HandleClient(TcpClient client)
    {
        using NetworkStream stream = client.GetStream();
        using StreamReader reader = new StreamReader(stream);
        while (!string.IsNullOrEmpty(reader.ReadLine())) {}

        string body = "<html><body><h1>Hello from C# HTTP Server</h1></body></html>";
        string response = "HTTP/1.1 200 OK\\r\\n" +
                          "Content-Type: text/html\\r\\n" +
                          $"Content-Length: {body.Length}\\r\\n" +
                          "Connection: close\\r\\n\\r\\n" +
                          body;

        byte[] buffer = Encoding.UTF8.GetBytes(response);
        stream.Write(buffer, 0, buffer.Length);
        client.Close();
    }
}`,
        language: `cs`,
        html: `<pre class="shiki catppuccin-mocha" style="background-color:#1e1e2e;color:#cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CBA6F7">using</span><span style="color:#F9E2AF;font-style:italic"> System</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#CBA6F7">using</span><span style="color:#F9E2AF;font-style:italic"> System</span><span style="color:#94E2D5">.</span><span style="color:#F9E2AF;font-style:italic">IO</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#CBA6F7">using</span><span style="color:#F9E2AF;font-style:italic"> System</span><span style="color:#94E2D5">.</span><span style="color:#F9E2AF;font-style:italic">Net</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#CBA6F7">using</span><span style="color:#F9E2AF;font-style:italic"> System</span><span style="color:#94E2D5">.</span><span style="color:#F9E2AF;font-style:italic">Net</span><span style="color:#94E2D5">.</span><span style="color:#F9E2AF;font-style:italic">Sockets</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#CBA6F7">using</span><span style="color:#F9E2AF;font-style:italic"> System</span><span style="color:#94E2D5">.</span><span style="color:#F9E2AF;font-style:italic">Text</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#CBA6F7">using</span><span style="color:#F9E2AF;font-style:italic"> System</span><span style="color:#94E2D5">.</span><span style="color:#F9E2AF;font-style:italic">Threading</span><span style="color:#9399B2">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">class</span><span style="color:#F9E2AF;font-style:italic"> SimpleHttpServer</span></span>
<span class="line"><span style="color:#9399B2">{</span></span>
<span class="line"><span style="color:#CBA6F7">    static</span><span style="color:#CBA6F7"> void</span><span style="color:#89B4FA;font-style:italic"> Main</span><span style="color:#9399B2">()</span></span>
<span class="line"><span style="color:#9399B2">    {</span></span>
<span class="line"><span style="color:#F9E2AF;font-style:italic">        TcpListener</span><span style="color:#CDD6F4"> listener </span><span style="color:#94E2D5">=</span><span style="color:#94E2D5"> new</span><span style="color:#F9E2AF;font-style:italic"> TcpListener</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">IPAddress</span><span style="color:#94E2D5">.</span><span style="color:#CDD6F4">Any</span><span style="color:#9399B2">,</span><span style="color:#FAB387"> 8080</span><span style="color:#9399B2">);</span></span>
<span class="line"><span style="color:#CDD6F4">        listener</span><span style="color:#94E2D5">.</span><span style="color:#89B4FA;font-style:italic">Start</span><span style="color:#9399B2">();</span></span>
<span class="line"><span style="color:#CBA6F7">        while</span><span style="color:#9399B2"> (</span><span style="color:#FAB387">true</span><span style="color:#9399B2">)</span></span>
<span class="line"><span style="color:#9399B2">        {</span></span>
<span class="line"><span style="color:#F9E2AF;font-style:italic">            TcpClient</span><span style="color:#CDD6F4"> client </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> listener</span><span style="color:#94E2D5">.</span><span style="color:#89B4FA;font-style:italic">AcceptTcpClient</span><span style="color:#9399B2">();</span></span>
<span class="line"><span style="color:#94E2D5">            new</span><span style="color:#F9E2AF;font-style:italic"> Thread</span><span style="color:#9399B2">(()</span><span style="color:#94E2D5"> =></span><span style="color:#89B4FA;font-style:italic"> HandleClient</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">client</span><span style="color:#9399B2">))</span><span style="color:#94E2D5">.</span><span style="color:#89B4FA;font-style:italic">Start</span><span style="color:#9399B2">();</span></span>
<span class="line"><span style="color:#9399B2">        }</span></span>
<span class="line"><span style="color:#9399B2">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">    static</span><span style="color:#CBA6F7"> void</span><span style="color:#89B4FA;font-style:italic"> HandleClient</span><span style="color:#9399B2">(</span><span style="color:#F9E2AF;font-style:italic">TcpClient</span><span style="color:#CDD6F4"> client</span><span style="color:#9399B2">)</span></span>
<span class="line"><span style="color:#9399B2">    {</span></span>
<span class="line"><span style="color:#CBA6F7">        using</span><span style="color:#F9E2AF;font-style:italic"> NetworkStream</span><span style="color:#CDD6F4"> stream </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> client</span><span style="color:#94E2D5">.</span><span style="color:#89B4FA;font-style:italic">GetStream</span><span style="color:#9399B2">();</span></span>
<span class="line"><span style="color:#CBA6F7">        using</span><span style="color:#F9E2AF;font-style:italic"> StreamReader</span><span style="color:#CDD6F4"> reader </span><span style="color:#94E2D5">=</span><span style="color:#94E2D5"> new</span><span style="color:#F9E2AF;font-style:italic"> StreamReader</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">stream</span><span style="color:#9399B2">);</span></span>
<span class="line"><span style="color:#CBA6F7">        while</span><span style="color:#9399B2"> (</span><span style="color:#94E2D5">!</span><span style="color:#CBA6F7">string</span><span style="color:#94E2D5">.</span><span style="color:#89B4FA;font-style:italic">IsNullOrEmpty</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">reader</span><span style="color:#94E2D5">.</span><span style="color:#89B4FA;font-style:italic">ReadLine</span><span style="color:#9399B2">()))</span><span style="color:#9399B2"> {}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">        string</span><span style="color:#CDD6F4"> body </span><span style="color:#94E2D5">=</span><span style="color:#A6E3A1"> "&#x3C;html>&#x3C;body>&#x3C;h1>Hello from C# HTTP Server&#x3C;/h1>&#x3C;/body>&#x3C;/html>"</span><span style="color:#9399B2">;</span></span>
<span class="line"><span style="color:#CBA6F7">        string</span><span style="color:#CDD6F4"> response </span><span style="color:#94E2D5">=</span><span style="color:#A6E3A1"> "HTTP/1.1 200 OK</span><span style="color:#F5C2E7">\r\n</span><span style="color:#A6E3A1">"</span><span style="color:#94E2D5"> +</span></span>
<span class="line"><span style="color:#A6E3A1">                          "Content-Type: text/html</span><span style="color:#F5C2E7">\r\n</span><span style="color:#A6E3A1">"</span><span style="color:#94E2D5"> +</span></span>
<span class="line"><span style="color:#A6E3A1">                          $"Content-Length: </span><span style="color:#9399B2">{</span><span style="color:#CDD6F4">body</span><span style="color:#94E2D5">.</span><span style="color:#CDD6F4">Length</span><span style="color:#9399B2">}</span><span style="color:#F5C2E7">\r\n</span><span style="color:#A6E3A1">"</span><span style="color:#94E2D5"> +</span></span>
<span class="line"><span style="color:#A6E3A1">                          "Connection: close</span><span style="color:#F5C2E7">\r\n\r\n</span><span style="color:#A6E3A1">"</span><span style="color:#94E2D5"> +</span></span>
<span class="line"><span style="color:#CDD6F4">                          body</span><span style="color:#9399B2">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">        byte</span><span style="color:#9399B2">[]</span><span style="color:#CDD6F4"> buffer </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> Encoding</span><span style="color:#94E2D5">.</span><span style="color:#CDD6F4">UTF8</span><span style="color:#94E2D5">.</span><span style="color:#89B4FA;font-style:italic">GetBytes</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">response</span><span style="color:#9399B2">);</span></span>
<span class="line"><span style="color:#CDD6F4">        stream</span><span style="color:#94E2D5">.</span><span style="color:#89B4FA;font-style:italic">Write</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">buffer</span><span style="color:#9399B2">,</span><span style="color:#FAB387"> 0</span><span style="color:#9399B2">,</span><span style="color:#CDD6F4"> buffer</span><span style="color:#94E2D5">.</span><span style="color:#CDD6F4">Length</span><span style="color:#9399B2">);</span></span>
<span class="line"><span style="color:#CDD6F4">        client</span><span style="color:#94E2D5">.</span><span style="color:#89B4FA;font-style:italic">Close</span><span style="color:#9399B2">();</span></span>
<span class="line"><span style="color:#9399B2">    }</span></span>
<span class="line"><span style="color:#9399B2">}</span></span>
<span class="line"></span></code></pre>`
    },
    {
        code: `import socket
import threading

HOST = '0.0.0.0'
PORT = 8080

def handle_client(conn):
    request = conn.recv(4096)
    body = b"<html><body><h1>Hello from Python HTTP Server</h1></body></html>"
    response = b"HTTP/1.1 200 OK\r\n" + \
               b"Content-Type: text/html\r\n" + \
               b"Content-Length: " + str(len(body)).encode() + b"\r\n" + \
               b"Connection: close\r\n\r\n" + \
               body
    conn.sendall(response)
    conn.close()

def main():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        s.bind((HOST, PORT))
        s.listen()
        while True:
            conn, addr = s.accept()
            threading.Thread(target=handle_client, args=(conn,), daemon=True).start()

if __name__ == "__main__":
    main()`,
        language: `py`,
        html: `<pre class="shiki catppuccin-mocha" style="background-color:#1e1e2e;color:#cdd6f4" tabindex="0"><code><span class="line"><span style="color:#CBA6F7">import</span><span style="color:#CDD6F4"> socket</span></span>
<span class="line"><span style="color:#CBA6F7">import</span><span style="color:#CDD6F4"> threading</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CDD6F4">HOST </span><span style="color:#94E2D5">=</span><span style="color:#A6E3A1"> '0.0.0.0'</span></span>
<span class="line"><span style="color:#CDD6F4">PORT </span><span style="color:#94E2D5">=</span><span style="color:#FAB387"> 8080</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">def</span><span style="color:#89B4FA;font-style:italic"> handle_client</span><span style="color:#9399B2">(</span><span style="color:#EBA0AC;font-style:italic">conn</span><span style="color:#9399B2">):</span></span>
<span class="line"><span style="color:#CDD6F4">    request </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> conn</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">recv</span><span style="color:#9399B2">(</span><span style="color:#FAB387">4096</span><span style="color:#9399B2">)</span></span>
<span class="line"><span style="color:#CDD6F4">    body </span><span style="color:#94E2D5">=</span><span style="color:#A6E3A1;font-style:italic"> b</span><span style="color:#A6E3A1">"&#x3C;html>&#x3C;body>&#x3C;h1>Hello from Python HTTP Server&#x3C;/h1>&#x3C;/body>&#x3C;/html>"</span></span>
<span class="line"><span style="color:#CDD6F4">    response </span><span style="color:#94E2D5">=</span><span style="color:#A6E3A1;font-style:italic"> b</span><span style="color:#A6E3A1">"HTTP/1.1 200 OK</span><span style="color:#F5C2E7">\r\n</span><span style="color:#A6E3A1">"</span><span style="color:#94E2D5"> +</span><span style="color:#9399B2"> \</span></span>
<span class="line"><span style="color:#A6E3A1;font-style:italic">               b</span><span style="color:#A6E3A1">"Content-Type: text/html</span><span style="color:#F5C2E7">\r\n</span><span style="color:#A6E3A1">"</span><span style="color:#94E2D5"> +</span><span style="color:#9399B2"> \</span></span>
<span class="line"><span style="color:#A6E3A1;font-style:italic">               b</span><span style="color:#A6E3A1">"Content-Length: "</span><span style="color:#94E2D5"> +</span><span style="color:#CBA6F7;font-style:italic"> str</span><span style="color:#9399B2">(</span><span style="color:#FAB387;font-style:italic">len</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">body</span><span style="color:#9399B2">)).</span><span style="color:#89B4FA">encode</span><span style="color:#9399B2">()</span><span style="color:#94E2D5"> +</span><span style="color:#A6E3A1;font-style:italic"> b</span><span style="color:#A6E3A1">"</span><span style="color:#F5C2E7">\r\n</span><span style="color:#A6E3A1">"</span><span style="color:#94E2D5"> +</span><span style="color:#9399B2"> \</span></span>
<span class="line"><span style="color:#A6E3A1;font-style:italic">               b</span><span style="color:#A6E3A1">"Connection: close</span><span style="color:#F5C2E7">\r\n\r\n</span><span style="color:#A6E3A1">"</span><span style="color:#94E2D5"> +</span><span style="color:#9399B2"> \</span></span>
<span class="line"><span style="color:#CDD6F4">               body</span></span>
<span class="line"><span style="color:#CDD6F4">    conn</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">sendall</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">response</span><span style="color:#9399B2">)</span></span>
<span class="line"><span style="color:#CDD6F4">    conn</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">close</span><span style="color:#9399B2">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">def</span><span style="color:#89B4FA;font-style:italic"> main</span><span style="color:#9399B2">():</span></span>
<span class="line"><span style="color:#CBA6F7">    with</span><span style="color:#CDD6F4"> socket</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">socket</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">socket</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">AF_INET</span><span style="color:#9399B2">,</span><span style="color:#CDD6F4"> socket</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">SOCK_STREAM</span><span style="color:#9399B2">)</span><span style="color:#CBA6F7"> as</span><span style="color:#CDD6F4"> s</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CDD6F4">        s</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">setsockopt</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">socket</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">SOL_SOCKET</span><span style="color:#9399B2">,</span><span style="color:#CDD6F4"> socket</span><span style="color:#9399B2">.</span><span style="color:#CDD6F4">SO_REUSEADDR</span><span style="color:#9399B2">,</span><span style="color:#FAB387"> 1</span><span style="color:#9399B2">)</span></span>
<span class="line"><span style="color:#CDD6F4">        s</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">bind</span><span style="color:#9399B2">((</span><span style="color:#CDD6F4">HOST</span><span style="color:#9399B2">,</span><span style="color:#CDD6F4"> PORT</span><span style="color:#9399B2">))</span></span>
<span class="line"><span style="color:#CDD6F4">        s</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">listen</span><span style="color:#9399B2">()</span></span>
<span class="line"><span style="color:#CBA6F7">        while</span><span style="color:#FAB387"> True</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#CDD6F4">            conn</span><span style="color:#9399B2">,</span><span style="color:#CDD6F4"> addr </span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4"> s</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">accept</span><span style="color:#9399B2">()</span></span>
<span class="line"><span style="color:#CDD6F4">            threading</span><span style="color:#9399B2">.</span><span style="color:#89B4FA">Thread</span><span style="color:#9399B2">(</span><span style="color:#EBA0AC;font-style:italic">target</span><span style="color:#94E2D5">=</span><span style="color:#CDD6F4">handle_client</span><span style="color:#9399B2">,</span><span style="color:#EBA0AC;font-style:italic"> args</span><span style="color:#94E2D5">=</span><span style="color:#9399B2">(</span><span style="color:#CDD6F4">conn</span><span style="color:#9399B2">,),</span><span style="color:#EBA0AC;font-style:italic"> daemon</span><span style="color:#94E2D5">=</span><span style="color:#FAB387">True</span><span style="color:#9399B2">).</span><span style="color:#89B4FA">start</span><span style="color:#9399B2">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CBA6F7">if</span><span style="color:#CDD6F4"> __name__ </span><span style="color:#94E2D5">==</span><span style="color:#A6E3A1"> "__main__"</span><span style="color:#9399B2">:</span></span>
<span class="line"><span style="color:#89B4FA">    main</span><span style="color:#9399B2">()</span></span>
<span class="line"></span></code></pre>`,
    }

]