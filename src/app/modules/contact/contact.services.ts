import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { search_query } from "./contact.constant";
import { ContactResponse, TContact } from "./contact.interface";
import contacts from "./contact.model";
import httpStatus from "http-status";
import sendEmail from "../../utils/sendEmail";
import { superAdminCredentials } from "../user/user.constant";

const createContactIntoDb = async (
  payload: TContact
): Promise<ContactResponse> => {
  try {
    const contactBuilder = new contacts(payload);
    const result = await contactBuilder.save();

    try {
      const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2 style="margin: 0 0 12px;">New Contact Message</h2>
          <p style="margin: 0 0 6px;"><strong>Name:</strong> ${payload.name}</p>
          <p style="margin: 0 0 6px;"><strong>Email:</strong> ${payload.email}</p>
          <p style="margin: 0 0 6px;"><strong>Question:</strong></p>
          <p style="margin: 0; white-space: pre-wrap;">${payload.question}</p>
        </div>
      `;

      await sendEmail(superAdminCredentials.email, html, "New Contact Message");
    } catch (error: any) {
      console.error("Send contact email error:", error);
    }

    return { status: true, message: "successfully recorded" };
  } catch (error: any) {
    console.error("Create contact DB error:", error);
    throw new AppError(
      httpStatus.SERVICE_UNAVAILABLE,
      error.message || "createContactIntoDb section unavailable",
      ""
    );
  }
};

const all_contact_IntoDb = async (query: Record<string, unknown>) => {
  try {
    const allContactQuery = new QueryBuilder(contacts.find({}), query)
      .search(search_query)
      .filter()
      .sort()
      .paginate()
      .fields();

    const allContactList = await allContactQuery.modelQuery;
    const meta = await allContactQuery.countTotal();
    return { meta, allContactList };
  } catch (error: any) {
    throw new AppError(
      error.statusCode || httpStatus.SERVICE_UNAVAILABLE,
      error.message || "Failed  all contact list",
      error
    );
  }
};

const specificContactIntoDb = async (id: string) => {
  try {
    return await contacts.findById(id).select("name email question");
  } catch (error: any) {
    throw new AppError(
      error.statusCode || httpStatus.SERVICE_UNAVAILABLE,
      error.message || "Failed specific contact Into Db",
      error
    );
  }
};

const updateContactIntoDb = async (id: string, payload: Partial<TContact>) => {
  try {
    const result = await contacts.findByIdAndUpdate(id, payload, {
      new: true,
      upsert: true,
    });
    return result && { status: true, message: "successfully updated" };
  } catch (error: any) {
    throw new AppError(
      error.statusCode || httpStatus.SERVICE_UNAVAILABLE,
      error.message || "Failed update contact Into Db",
      error
    );
  }
};

const deleteContactIntoDb = async (id: string) => {
  try {
    const result = await contacts.findByIdAndDelete(id);
    return result && { status: true, message: "successfully delete contact" };
  } catch (error: any) {
    throw new AppError(
      error.statusCode || httpStatus.SERVICE_UNAVAILABLE,
      error.message || "Failed delete contact Into Db",
      error
    );
  }
};

const contactController = {
  createContactIntoDb,
  all_contact_IntoDb,
  specificContactIntoDb,
  updateContactIntoDb,
  deleteContactIntoDb,
};

export default contactController;
