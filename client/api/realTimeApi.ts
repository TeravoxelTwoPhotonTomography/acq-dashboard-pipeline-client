import * as socketIOClient from "socket.io-client";

export interface IRealTimeApiDelegate {
    onServiceConnectionStateChanged?(isConnected: boolean): void;
}

export class RealTimeApi {
    private _socket: any = null;
    public constructor(delegate?: IRealTimeApiDelegate) {
        this.Delegate = delegate;
    }

    public Delegate: IRealTimeApiDelegate = null;

    public async connect(portOffset: number = 0) {
        try {
            const loc = window.location;

            const port = parseInt(loc.port);
            const portString = isNaN(port) ? "" : `:${port + portOffset}`;

            const url = `${loc.protocol}//${loc.hostname}${portString}`;
            this._socket = socketIOClient(url);

            this._socket.on("connect", () => this.onServiceConnectionStateChanged(true));
            this._socket.on("disconnect", () => this.onServiceConnectionStateChanged(false));
            console.log(`established socket.io connection ${url}`);
        } catch (err) {
            console.log(err);
            console.log("could not establish socket-io connection; deferring socket-io connection");
            setTimeout(() => this.connect(), 15000);
            return;
        }
    }

    public close() {
        if (this._socket) {
            this._socket.close();
            this._socket = null;
        }
    }

    private onServiceConnectionStateChanged = (b: boolean) => {
        if (this.Delegate && this.Delegate.onServiceConnectionStateChanged) {
            this.Delegate.onServiceConnectionStateChanged(b);
        }
    };
}
