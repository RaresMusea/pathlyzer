"use client";

import { Button } from "../ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";

export const LogoutModal = ({ deauth, closeDialog }: { deauth: () => void; closeDialog: () => void }) => {
    return (
        <>
            <DialogContent className="border-none shadow-lg font-nunito">
                <DialogHeader>
                    <DialogTitle>Log out</DialogTitle>
                    <DialogDescription className="text-muted-foreground pt-2">
                        You'll be signed out. We'll be here when you return!
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button className="text-white bg-red-500 outline-none border-none hover:bg-red-700 focus:ring-0 font-semibold" type="submit" onClick={deauth}>Log out</Button>
                    <Button variant="secondary" className="text-semibold" onClick={closeDialog}>Cancel</Button>
                </DialogFooter>
            </DialogContent>
        </>
    );
}