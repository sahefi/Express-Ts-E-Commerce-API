import HttpStatusCodes from "@src/constants/HttpStatusCodes";

export class CorePaginatedRespDto<T> {
    constructor({
      data = [],
      page = 1,
      per_page = 10,
      total = 0,
      next_page = 1,
      prev_page = 0,
    }) {
      this.data = data;
      this.page = page;
      this.per_page = per_page;
      this.total = total;
      this.next_page = next_page;
      this.prev_page = prev_page;
    }
    data: T[];
    page: number;
    per_page: number;
    total: number;
    next_page: number;
    prev_page: number;
  }
  
  export class CompletePaginatedRespDto<T> extends CorePaginatedRespDto<T> {
    constructor({
      success = true,
      message = 'Data retrieved successfully',
      code = HttpStatusCodes.OK,
      data = [],
      page = 1,
      per_page = 10,
      total = 0,
      next_page = 1,
      prev_page = 0,
    }) {
      super({
        data,
        page,
        per_page,
        total,
        next_page,
        prev_page,
      });
      this.success = success;
      this.message = message;
      this.code = code;
    }
    success: boolean;
    message: string;
    code: HttpStatusCodes;
  }