# blog.waymondrang.com

# upload flow

```sh
[POST /upload] -> [lambda upload function] -> [insert into dynamo db] -> [generate static site] -> [upload into s3]
                                           |
                                           -> # todo
```

# api

### \[POST\] /api/upload

request data:

```jsonc
{
    "title": "blog title",
    "content": "<p>hello world</p>",
    "oneLiner": "optional description (good practice to include)",
    "uploadDate": "<iso datestring>",
}
```

response data:

```json
{
    "message": "success message",
    "blogId": "blog-title-parsed"
}
```

## inspiration

https://www.w3.org/QA/Tools/Icons - w3c validation icons
https://www.w3.org/Icons/ - the w3c icon repository
https://cyber.dabamos.de/88x31/index.html - the 88x31 gif collection
https://gifcities.org/ - the geocities gif archive
