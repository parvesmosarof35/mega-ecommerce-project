import status from "http-status";
import AppError from "../../errors/AppError";
import { FaqResponse, TFaq } from "./faq.interface";
import faqs from "./faq.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { search_query } from "./faq.constant";

const createFAQIntoDb = async (payload: TFaq): Promise<FaqResponse> => {
  try {
    const faqBuilder = new faqs(payload);
    const result = await faqBuilder.save();
    return result && { status: true, message: "successfully recorded" };
  } catch (error: any) {
    throw new AppError(
      error.statusCode || status.SERVICE_UNAVAILABLE,
      error.message || "Failed   create faq section",
      error
    );
  }
};

const findByAllFaqIntoDb = async (query: Record<string, unknown>) => {
  try {
    const allFaqQuery = new QueryBuilder(
      faqs.find({}).select("-isDelete -createdAt -updatedAt"),
      query
    )
      .search(search_query)
      .filter()
      .sort()
      .paginate()
      .fields();

    const allFaqList = await allFaqQuery.modelQuery;
    const meta = await allFaqQuery.countTotal();
    return { meta, allFaqList };
  } catch (error: any) {
    throw new AppError(
      error.statusCode || status.SERVICE_UNAVAILABLE,
      error.message || "Failed find by all faq section",
      error
    );
  }
};

const findBySpecificFaqIntoDb = async (id: string) => {
  try {
    return await faqs.findById(id).select("-isDelete -createdAt -updatedAt");
  } catch (error: any) {
    throw new AppError(
      error.statusCode || status.SERVICE_UNAVAILABLE,
      error.message || "Failed find by  specific Faq section ",
      error
    );
  }
};

const updateFaqIntoDb = async (
  id: string,
  payload: Partial<TFaq>
): Promise<FaqResponse> => {
  try {
    const result = await faqs.findByIdAndUpdate(id, payload, {
      new: true,
      upsert: true,
    });

    return result && { status: true, message: " successfully update faq" };
  } catch (error: any) {
    throw new AppError(
      error.statusCode || status.SERVICE_UNAVAILABLE,
      error.message || "Failed update Faq IntoDb section ",
      error
    );
  }
};

const deleteFaqIntoDb = async (id: string): Promise<FaqResponse> => {
  try {
    const result = await faqs.findByIdAndDelete(id);

    if (!result) {
      throw new AppError(status.NOT_FOUND, "FAQ not found");
    }

    return { status: true, message: "Successfully deleted FAQ" };
  } catch (error: any) {
    throw new AppError(
      error.statusCode || status.SERVICE_UNAVAILABLE,
      error.message || "Failed to delete FAQ",
      error
    );
  }
};

const FaqServices = {
  createFAQIntoDb,
  findByAllFaqIntoDb,
  findBySpecificFaqIntoDb,
  updateFaqIntoDb,
  deleteFaqIntoDb,
};
export default FaqServices;
