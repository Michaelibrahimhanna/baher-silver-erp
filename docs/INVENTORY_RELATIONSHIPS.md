# Inventory Relationships & Database Matrix - Baher Silver ERP

This document specifies the relational database mappings connecting master records, warehouse locations, movement ledgers, and double-entry accounting.

---

## 🔗 Entity Relationship Mappings

```text
[ Warehouse (WH-01..07) ] ──1:N──➔ [ Master Entity (Stone/Silver/Raw) ]
                                            │
                                            ├──1:N──➔ [ LotBatch ]
                                            ├──1:N──➔ [ Attachment & Certificate ]
                                            ├──1:N──➔ [ PricingHistory & StockHistory ]
                                            └──1:N──➔ [ Inventory Movement ] ──1:1──➔ [ JournalEntry (GL) ]
```
