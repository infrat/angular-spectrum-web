import { IncomingData } from "src/app/types/data.type";

export interface DataSourceService {
  cast(data: IncomingData): any;
}
