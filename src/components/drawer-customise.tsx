import {Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger,} from "@/components/ui/drawer"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {Button} from "@/components/ui/button";
import {Settings} from "lucide-react";

export function CustomiseDrawer(){

    return(
        <Drawer>
            <DrawerTrigger>
                <Button className={'m-3 cursor-pointer'}>
                    <Settings />
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Customise Dashboard</DrawerTitle>
                    <DrawerDescription></DrawerDescription>
                </DrawerHeader>

                <div className={'p-5 flex flex-row flex-wrap  justify-evenly'}>

                    <div className="flex items-center space-x-2 my-2">
                        <Switch id="sec1" />
                        <Label htmlFor="sec1">Dashboard Section</Label>
                    </div>

                    <div className="flex items-center space-x-2 my-2">
                        <Switch id="sec2" />
                        <Label htmlFor="sec2">Dashboard Section</Label>
                    </div>

                    <div className="flex items-center space-x-2 my-2">
                        <Switch id="sec3" />
                        <Label htmlFor="sec3">Dashboard Section</Label>
                    </div>

                    <div className="flex items-center space-x-2 my-2">
                        <Switch id="sec4" />
                        <Label htmlFor="sec4">Dashboard Section</Label>
                    </div>

                    <div className="flex items-center space-x-2 my-2">
                        <Switch id="sec5" />
                        <Label htmlFor="sec5">Dashboard Section</Label>
                    </div>
                </div>

                <DrawerFooter>
                    <DrawerClose>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}