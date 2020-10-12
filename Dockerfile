FROM ubuntu:18.04

ADD dist/bin /bin
ENTRYPOINT [ "/bin" ]

