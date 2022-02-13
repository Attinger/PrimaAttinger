namespace Bomberman {  
    export class DataEvent extends Event {
        private data: any;
        constructor(type: string, eventInitDict: EventInit, data: any) {
            super(type, eventInitDict);
            this.data = data;
        }
        public getData(): any {
            return this.data;
        }
    }
}